import { apiClient } from './apiClient';
import { tokenStorage } from './tokenStorage';
import { log } from './log';
import type { GameEventPayload } from './gameEvents';

const WS_BASE = 'ws://localhost:8080/ws/game-events';
const RECONNECT_DELAY_MS = 3000;

class WebSocketClient {
  private isOnline = navigator.onLine;
  private ws: WebSocket | null = null;
  private reconnectTimeout: number | null = null;
  private reconnectAttempts = 0;
  private connectPromise: Promise<void> | null = null;
  private isRefreshing = false;
  private pendingSendQueue: Array<Record<string, unknown>> = [];

  constructor() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  private handleOnline = () => {
    this.isOnline = true;

    log('Network ONLINE - reconnecting WebSocket', 'wsClient', 'network');

    // immediate reconnect (no waiting for backoff timer)
    void this.connect().catch(() => this.scheduleReconnect());
  };

  private handleOffline = () => {
    this.isOnline = false;
    this.reconnectAttempts = 0;

    log('Network OFFLINE - stopping reconnect attempts', 'wsClient', 'network');

    this.disconnect();
  };

  connect(): Promise<void> {
    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = new Promise(async (resolve, reject) => {
      const cleanup = () => {
        this.connectPromise = null;
      };

      const createConnection = async (
        retryAfterRefresh = true,
      ): Promise<void> => {
        try {
          let accessToken = tokenStorage.getAccessToken();

          // No access token -> try refresh first
          if (!accessToken) {
            log(
              'No access token found. Refreshing before WS connect',
              'src/lib/wsClient.ts',
              'connect',
            );

            accessToken = await apiClient.refreshToken();

            if (!accessToken) {
              throw new Error('Unable to refresh access token');
            }

            tokenStorage.setAccessToken(accessToken);
          }

          const url = `${WS_BASE}?access_token=${encodeURIComponent(
            accessToken,
          )}`;

          this.ws = new WebSocket(url);

          const openHandler = () => {
            cleanup();
            this.reconnectAttempts = 0;

            log(
              `WebSocket connected: ${url}`,
              'src/lib/wsClient.ts',
              'connect',
            );

            try {
              // eslint-disable-next-line no-console
              console.info('WebSocket open:', url);
            } catch {
              /* ignore */
            }

            this.flushSendQueue();
            resolve();
          };

          const errorHandler = async (ev: Event) => {
            log(`WebSocket connection error`, 'src/lib/wsClient.ts', 'connect');

            try {
              // eslint-disable-next-line no-console
              console.error('WebSocket error:', ev);
            } catch {
              /* ignore */
            }

            // Try a token refresh once on connection failure
            if (retryAfterRefresh) {
              try {
                const refreshedToken = await apiClient.refreshToken();

                if (refreshedToken) {
                  tokenStorage.setAccessToken(refreshedToken);

                  cleanup();

                  if (this.ws) {
                    this.ws.close();
                    this.ws = null;
                  }

                  await createConnection(false);
                  return;
                }
              } catch {
                /* ignore */
              }
            }

            cleanup();
            reject(ev);
          };

          const closeHandler = (ev?: CloseEvent) => {
            cleanup();

            log(
              `WebSocket closed (${ev?.code})`,
              'src/lib/wsClient.ts',
              'connect',
            );

            try {
              // eslint-disable-next-line no-console
              console.info('WebSocket closed:', ev?.code, ev?.reason);
            } catch {
              /* ignore */
            }

            if (this.isAuthCloseEvent(ev)) {
              void this.refreshAuthAndReconnect();
              return;
            }

            this.scheduleReconnect();
          };

          this.ws.addEventListener('open', openHandler);
          this.ws.addEventListener('error', errorHandler);
          this.ws.addEventListener('close', closeHandler);

          this.ws.addEventListener('message', (msg) => {
            try {
              const data = JSON.parse(msg.data);

              log(
                `WS message: ${JSON.stringify(data)}`,
                'src/lib/wsClient.ts',
                'message',
              );

              if (this.isWebSocketAuthMessage(data)) {
                log(
                  'WebSocket auth failure detected, refreshing token and reconnecting',
                  'src/lib/wsClient.ts',
                  'message',
                );

                void this.refreshAuthAndReconnect();
                return;
              }

              try {
                // eslint-disable-next-line no-console
                console.debug('WS RAW MESSAGE:', msg.data);
                this.processMessage(data);
                // eslint-disable-next-line no-console
                console.log('WebSocket message:', data);
              } catch {
                /* ignore */
              }
            } catch {
              log(
                `WS raw message: ${msg.data}`,
                'src/lib/wsClient.ts',
                'message',
              );

              try {
                // eslint-disable-next-line no-console
                console.debug('WS RAW MESSAGE (parse failed):', msg.data);

                // eslint-disable-next-line no-console
                console.log('WebSocket raw message:', msg.data);
              } catch {
                /* ignore */
              }
            }
          });
        } catch (err) {
          cleanup();
          reject(err);
        }
      };

      await createConnection();
    });

    return this.connectPromise;
  }

  private scheduleReconnect() {
    if (!this.isOnline) {
      log('Skip reconnect - user is offline', 'wsClient', 'scheduleReconnect');
      return;
    }

    if (this.reconnectTimeout) return;

    this.reconnectAttempts++;

    const delay = RECONNECT_DELAY_MS * Math.min(this.reconnectAttempts, 6);

    this.reconnectTimeout = window.setTimeout(() => {
      this.reconnectTimeout = null;

      if (!this.isOnline) return;

      this.connect().catch(() => this.scheduleReconnect());
    }, delay);
  }

  private flushSendQueue() {
    if (this.pendingSendQueue.length === 0) {
      return;
    }

    const queued = [...this.pendingSendQueue];
    this.pendingSendQueue = [];

    for (const payload of queued) {
      this.sendEvent(payload);
    }
  }

  private async refreshAuthAndReconnect() {
    if (this.isRefreshing) {
      return;
    }

    this.isRefreshing = true;
    try {
      log(
        'Refreshing access token for WebSocket authentication',
        'src/lib/wsClient.ts',
        'refreshAuthAndReconnect',
      );
      const refreshedAccessToken = await apiClient.refreshToken();

      if (!refreshedAccessToken) {
        log(
          'WebSocket refresh failed, clearing tokens',
          'src/lib/wsClient.ts',
          'refreshAuthAndReconnect',
        );
        tokenStorage.clearTokens();
        return;
      }

      tokenStorage.setAccessToken(refreshedAccessToken);
      this.disconnect();
      await this.connect();
    } catch (error) {
      log(
        `WebSocket refresh error: ${error}`,
        'src/lib/wsClient.ts',
        'refreshAuthAndReconnect',
      );
      this.scheduleReconnect();
    } finally {
      this.isRefreshing = false;
    }
  }

  private isAuthCloseEvent(ev?: CloseEvent): boolean {
    if (!ev) {
      return false;
    }

    if ([1008, 4401, 4001, 4003].includes(ev.code)) {
      return true;
    }

    const reason = String(ev.reason ?? '').toLowerCase();
    return (
      reason.includes('403') ||
      reason.includes('forbidden') ||
      reason.includes('unauthorized')
    );
  }

  private isWebSocketAuthMessage(data: unknown): boolean {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const payload = data as Record<string, unknown>;
    const status = payload.status;
    const message = String(
      payload.message ?? payload.error ?? '',
    ).toLowerCase();

    if (status === 403 || status === '403') {
      return true;
    }

    return (
      message.includes('403') ||
      message.includes('forbidden') ||
      message.includes('unauthorized')
    );
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.reconnectAttempts = 0;
  }

  sendEvent(payload: Record<string, unknown>) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      log(
        'WebSocket not open - queuing event',
        'src/lib/wsClient.ts',
        'sendEvent',
      );
      this.pendingSendQueue.push(payload);

      if (!this.connectPromise) {
        void this.connect().catch(() => {
          /* ignore connection failure */
        });
      }

      return true;
    }

    try {
      const raw = JSON.stringify(payload);
      this.ws.send(raw);
      // log outgoing payloads to console for debugging
      try {
        // eslint-disable-next-line no-console
        console.debug('WS SEND:', raw);
      } catch (e) {
        /* ignore */
      }
      return true;
    } catch (err) {
      log(
        `Failed to send WS message: ${err}`,
        'src/lib/wsClient.ts',
        'sendEvent',
      );
      return false;
    }
  }

  sendGameEvent(payload: GameEventPayload) {
    return this.sendEvent(payload);
  }

  private processMessage(data: any) {
    switch (data.type) {
      case 'wallet_update':
        overwolf.windows.sendMessage(
          'desktop',
          'wallet_update',
          {
            coinBalance: data.coinBalance,
          },
          (result) => {
            console.log('SEND RESULT:', result);
          },
        );
        break;

      // case 'progress_update':
      //   console.log('ENTERED progress_update CASE', data);
      //   overwolf.windows.sendMessage(
      //     'desktop',
      //     'progress_update',
      //     data.updates,
      //     (result) => {
      //       console.log('PROGRESS_UPDATE SENT:', result);
      //     },
      //   );
      //   break;

      case 'progress_update':
        console.log('ENTERED progress_update CASE', data);

        overwolf.windows.sendMessage(
          'desktop',
          'progress_update',
          {
            updates: data.updates,
          },
          (result) => {
            console.log('PROGRESS_UPDATE SENT:', result);
          },
        );
        break;

      case 'game_started':
        // gameStore.getState().setGame(data.game);
        break;

      case 'game_finished':
        // gameStore.getState().clearGame();
        break;
    }
  }
}

export const wsClient = new WebSocketClient();
