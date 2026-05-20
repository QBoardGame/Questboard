/**
 * WebSocket Connection Manager
 * - Establishes connection after login
 * - Handles reconnection on disconnect
 * - Sends authorization token on connection
 */

import { tokenStorage } from "./tokenStorage";
import { log } from "./log";

interface WebSocketMessage {
  type: string;
  data?: unknown;
}

type WebSocketEventHandler = (data?: unknown) => void;

const WS_BASE = "ws://localhost:8080/api/ws";
const RECONNECT_DELAY_MS = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;

class WebSocketManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private reconnectTimeoutId: NodeJS.Timeout | null = null;
  private eventHandlers = new Map<string, Set<WebSocketEventHandler>>();

  /**
   * Establish WebSocket connection
   */
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const accessToken = tokenStorage.getAccessToken();

        if (!accessToken) {
          throw new Error("No access token available for WebSocket connection");
        }

        const url = `${WS_BASE}?access_token=${encodeURIComponent(accessToken)}`;
        log(`Connecting to WebSocket: ${url}`, "src/lib/websocket.ts", "connect");

        this.ws = new WebSocket(url);

        this.ws.onopen = () => {
          log("WebSocket connected", "src/lib/websocket.ts", "connect");
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event.data);
        };

        this.ws.onerror = (error) => {
          log(
            `WebSocket error: ${error}`,
            "src/lib/websocket.ts",
            "connect"
          );
          reject(error);
        };

        this.ws.onclose = () => {
          log("WebSocket disconnected", "src/lib/websocket.ts", "connect");
          this.attemptReconnect();
        };

        // Timeout if connection takes too long
        const connectionTimeout = setTimeout(() => {
          if (this.ws?.readyState === WebSocket.CONNECTING) {
            this.ws.close();
            reject(new Error("WebSocket connection timeout"));
          }
        }, 10000);

        const originalOnOpen = this.ws.onopen;
        this.ws.onopen = (event) => {
          clearTimeout(connectionTimeout);
          // ensure both the handler and the websocket exist before calling
          if (originalOnOpen && this.ws) {
            originalOnOpen.call(this.ws, event);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    log("Disconnecting WebSocket", "src/lib/websocket.ts", "disconnect");

    if (this.reconnectTimeoutId) {
      clearTimeout(this.reconnectTimeoutId);
      this.reconnectTimeoutId = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.reconnectAttempts = 0;
  }

  /**
   * Send a message through WebSocket
   */
  send(type: string, data?: unknown) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      log(
        `Cannot send message - WebSocket not connected (state: ${this.ws?.readyState})`,
        "src/lib/websocket.ts",
        "send"
      );
      return;
    }

    const message: WebSocketMessage = { type, data };
    this.ws.send(JSON.stringify(message));
  }

  /**
   * Subscribe to WebSocket events
   */
  on(eventType: string, handler: WebSocketEventHandler) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, new Set());
    }
    this.eventHandlers.get(eventType)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(eventType)?.delete(handler);
    };
  }

  /**
   * Unsubscribe from WebSocket events
   */
  off(eventType: string, handler: WebSocketEventHandler) {
    this.eventHandlers.get(eventType)?.delete(handler);
  }

  /**
   * Get connection status
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Handle incoming WebSocket messages
   */
  private handleMessage(rawData: string) {
    try {
      const message: WebSocketMessage = JSON.parse(rawData);
      const handlers = this.eventHandlers.get(message.type);

      if (handlers) {
        handlers.forEach((handler) => handler(message.data));
      } else {
        log(
          `No handlers for event: ${message.type}`,
          "src/lib/websocket.ts",
          "handleMessage"
        );
      }
    } catch (error) {
      log(
        `Error parsing WebSocket message: ${error}`,
        "src/lib/websocket.ts",
        "handleMessage"
      );
    }
  }

  /**
   * Attempt to reconnect after disconnect
   */
  private attemptReconnect() {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      log(
        `Max reconnection attempts reached (${MAX_RECONNECT_ATTEMPTS})`,
        "src/lib/websocket.ts",
        "attemptReconnect"
      );
      return;
    }

    this.reconnectAttempts++;
    const delayMs = RECONNECT_DELAY_MS * this.reconnectAttempts;

    log(
      `Attempting to reconnect... (attempt ${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}, delay ${delayMs}ms)`,
      "src/lib/websocket.ts",
      "attemptReconnect"
    );

    this.reconnectTimeoutId = setTimeout(() => {
      this.connect().catch((error) => {
        log(
          `Reconnection failed: ${error}`,
          "src/lib/websocket.ts",
          "attemptReconnect"
        );
        this.attemptReconnect();
      });
    }, delayMs);
  }
}

export const wsManager = new WebSocketManager();
