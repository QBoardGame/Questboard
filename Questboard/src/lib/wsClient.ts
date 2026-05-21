import { tokenStorage } from "./tokenStorage";
import { log } from "./log";

const WS_BASE = "ws://localhost:8080/ws/game-events";
const RECONNECT_DELAY_MS = 3000;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectTimeout: number | null = null;
  private reconnectAttempts = 0;

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const accessToken = tokenStorage.getAccessToken();

        const url = accessToken
          ? `${WS_BASE}?access_token=${encodeURIComponent(accessToken)}`
          : WS_BASE;

        this.ws = new WebSocket(url);

        const openHandler = () => {
          this.reconnectAttempts = 0;
          log(`WebSocket connected: ${url}`, "src/lib/wsClient.ts", "connect");
          resolve();
        };

        const errorHandler = (ev: Event) => {
          log(`WebSocket error: ${ev}`, "src/lib/wsClient.ts", "connect");
          reject(ev);
        };

        const closeHandler = () => {
          log("WebSocket closed", "src/lib/wsClient.ts", "connect");
          this.scheduleReconnect();
        };

        this.ws.addEventListener("open", openHandler);
        this.ws.addEventListener("error", errorHandler);
        this.ws.addEventListener("close", closeHandler);

        this.ws.addEventListener("message", (msg) => {
          try {
            const data = JSON.parse(msg.data);
            log(`WS message: ${JSON.stringify(data)}`, "src/lib/wsClient.ts", "message");
          } catch (e) {
            log(`WS raw message: ${msg.data}`, "src/lib/wsClient.ts", "message");
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;
    this.reconnectAttempts++;
    this.reconnectTimeout = window.setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect().catch(() => this.scheduleReconnect());
    }, RECONNECT_DELAY_MS * Math.min(this.reconnectAttempts, 6));
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
      log("WebSocket not open - cannot send event", "src/lib/wsClient.ts", "sendEvent");
      return false;
    }
    try {
      this.ws.send(JSON.stringify(payload));
      return true;
    } catch (err) {
      log(`Failed to send WS message: ${err}`, "src/lib/wsClient.ts", "sendEvent");
      return false;
    }
  }
}

export const wsClient = new WebSocketClient();
