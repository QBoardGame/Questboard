// import { wsClient } from '../lib/wsClient';

// class GameEventsWSBridge {
//   private listeners = new Set<(event: any) => void>();
//   send(event: { type: string; payload: any }) {
//     wsClient.sendEvent({
//       //   source: "OVERWOLF",
//       //   timestamp: Date.now(),
//       //   type: event.type,
//       payload: event.payload,
//     });
//     this.listeners.forEach((listener) => listener(event.payload));
//   }
//   subscribe(listener: (event: any) => void) {
//     this.listeners.add(listener);

//     return () => {
//       this.listeners.delete(listener);
//     };
//   }
// }

// export const gameEventsWSBridge = new GameEventsWSBridge();


import { wsClient } from '../lib/wsClient';
import { store } from './store';
import { addGameEvent } from './gameSlice';

class GameEventsWSBridge {
  send(event: { type: string; payload: any }) {
    // send to backend
    wsClient.sendEvent({
      payload: event.payload,
    });

    // update frontend immediately
    store.dispatch(addGameEvent(event.payload));
  }
}

export const gameEventsWSBridge = new GameEventsWSBridge();