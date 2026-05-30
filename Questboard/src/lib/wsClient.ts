import { apiClient } from "./apiClient";
import { tokenStorage } from "./tokenStorage";
import { log } from "./log";
import type { GameEventPayload } from "./gameEvents";

const WS_BASE = "ws://localhost:8080/ws/game-events";
const RECONNECT_DELAY_MS = 3000;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectTimeout: number | null = null;
  private reconnectAttempts = 0;
  private connectPromise: Promise<void> | null = null;
  private isRefreshing = false;
  private pendingSendQueue: Array<Record<string, unknown>> = [];

  connect(): Promise<void> {
    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.connectPromise = new Promise((resolve, reject) => {

      try {
        const accessToken = tokenStorage.getAccessToken();

        const url = accessToken
          ? `${WS_BASE}?access_token=${encodeURIComponent(accessToken)}`
          : WS_BASE;

        this.ws = new WebSocket(url);

        const cleanup = () => {
          this.connectPromise = null;
        };

        const openHandler = () => {
          cleanup();
          this.reconnectAttempts = 0;
          log(`WebSocket connected: ${url}`, "src/lib/wsClient.ts", "connect");
          try {
            // eslint-disable-next-line no-console
            console.info("WebSocket open:", url);
          } catch (e) {
            /* ignore */
          }
          this.flushSendQueue();
          resolve();
        };

        const errorHandler = (ev: Event) => {
          cleanup();
          log(`WebSocket error: ${ev}`, "src/lib/wsClient.ts", "connect");
          try {
            // eslint-disable-next-line no-console
            console.error("WebSocket error:", ev);
            // eslint-disable-next-line no-console
            console.log("WebSocket error (console.log):", ev);
          } catch (e) {
            /* ignore */
          }
          reject(ev);
        };

        const closeHandler = (ev?: CloseEvent) => {
          cleanup();
          log("WebSocket closed", "src/lib/wsClient.ts", "connect");
          try {
            // eslint-disable-next-line no-console
            console.info("WebSocket closed:", ev?.code, ev?.reason);
          } catch (e) {
            /* ignore */
          }

          if (this.isAuthCloseEvent(ev)) {
            void this.refreshAuthAndReconnect();
          } else {
            this.scheduleReconnect();
          }
        };

        this.ws.addEventListener("open", openHandler);
        this.ws.addEventListener("error", errorHandler);
        this.ws.addEventListener("close", closeHandler);

        this.ws.addEventListener("message", (msg) => {
          try {
            const data = JSON.parse(msg.data);
            log(`WS message: ${JSON.stringify(data)}`, "src/lib/wsClient.ts", "message");

            if (this.isWebSocketAuthMessage(data)) {
              log("WebSocket auth failure detected, refreshing token and reconnecting", "src/lib/wsClient.ts", "message");
              void this.refreshAuthAndReconnect();
              return;
            }

            // also output raw message for easier console inspection
            try {
              // eslint-disable-next-line no-console
              console.debug("WS RAW MESSAGE:", msg.data);
              // eslint-disable-next-line no-console
              console.log("WebSocket message:", data);
            } catch (e) {
              /* ignore console errors */
            }
          } catch (e) {
            log(`WS raw message: ${msg.data}`, "src/lib/wsClient.ts", "message");
            try {
              // eslint-disable-next-line no-console
              console.debug("WS RAW MESSAGE (parse failed):", msg.data);
              // eslint-disable-next-line no-console
              console.log("WebSocket raw message:", msg.data);
            } catch (err) {
              /* ignore */
            }
          }
        });
      } catch (err) {
        reject(err);
      }
    });

    return this.connectPromise;
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;
    this.reconnectAttempts++;
    const delay = RECONNECT_DELAY_MS * Math.min(this.reconnectAttempts, 6);
    log(`Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`, "src/lib/wsClient.ts", "scheduleReconnect");
    try {
      // eslint-disable-next-line no-console
      console.info(`WS reconnect scheduled (attempt ${this.reconnectAttempts}) in ${delay}ms`);
    } catch (e) {
      /* ignore */
    }
    this.reconnectTimeout = window.setTimeout(() => {
      this.reconnectTimeout = null;
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
      log("Refreshing access token for WebSocket authentication", "src/lib/wsClient.ts", "refreshAuthAndReconnect");
      const refreshedAccessToken = await apiClient.refreshToken();

      if (!refreshedAccessToken) {
        log("WebSocket refresh failed, clearing tokens", "src/lib/wsClient.ts", "refreshAuthAndReconnect");
        tokenStorage.clearTokens();
        return;
      }

      tokenStorage.setAccessToken(refreshedAccessToken);
      this.disconnect();
      await this.connect();
    } catch (error) {
      log(`WebSocket refresh error: ${error}`, "src/lib/wsClient.ts", "refreshAuthAndReconnect");
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

    const reason = String(ev.reason ?? "").toLowerCase();
    return reason.includes("403") || reason.includes("forbidden") || reason.includes("unauthorized");
  }

  private isWebSocketAuthMessage(data: unknown): boolean {
    if (!data || typeof data !== "object") {
      return false;
    }

    const payload = data as Record<string, unknown>;
    const status = payload.status;
    const message = String(payload.message ?? payload.error ?? "").toLowerCase();

    if (status === 403 || status === "403") {
      return true;
    }

    return message.includes("403") || message.includes("forbidden") || message.includes("unauthorized");
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
      log("WebSocket not open - queuing event", "src/lib/wsClient.ts", "sendEvent");
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
        console.debug("WS SEND:", raw);
      } catch (e) {
        /* ignore */
      }
      return true;
    } catch (err) {
      log(`Failed to send WS message: ${err}`, "src/lib/wsClient.ts", "sendEvent");
      return false;
    }
  }

  sendGameEvent(payload: GameEventPayload) {
    return this.sendEvent(payload);
  }
}

export const wsClient = new WebSocketClient();
