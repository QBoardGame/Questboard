import { wsClient } from "../lib/wsClient";

class GameEventsWSBridge {
  send(event: {
    type: string;
    payload: any;
  }) {
    wsClient.sendEvent({
    //   source: "OVERWOLF",
    //   timestamp: Date.now(),
    //   type: event.type,
      payload: event.payload,
    });
  }
}

export const gameEventsWSBridge = new GameEventsWSBridge();