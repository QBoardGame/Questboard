// import {
//   REQUIRED_FEATURES,
//   WINDOW_NAMES,
//   RETRY_TIMES,
//   DISPLAY_OVERWOLF_HOOKS_LOGS,
// } from "app/shared/constants";
// import { useGameEventProvider, useWindow } from "overwolf-hooks";
// import { useCallback, useEffect, useRef } from "react";
// import { getRunningGameInfo } from "lib/games";
// import { buildGameEventPayload, getGameSlugFromTitle } from "lib/gameEvents";
// import { setInfo, setEvent } from "../stores/background";
// import store from "app/shared/store";
// import { log } from "lib/log";
// import { wsClient } from "lib/wsClient";
// import { tokenStorage } from "lib/tokenStorage";

// const { DESKTOP, INGAME } = WINDOW_NAMES;

// function extractEventName(event: any): string | null {
//   if (!event) {
//     return null;
//   }

//   return (
//     event.name ??
//     event.eventName ??
//     event.event_name ??
//     event.eventType ??
//     event.event_type ??
//     event.id ??
//     event.event?.name ??
//     event.event?.eventName ??
//     event.event?.event_name ??
//     event.event?.type ??
//     event.event?.id ??
//     null
//   );
// }

// function normalizeEvents(payload: unknown): Array<Record<string, unknown>> {
//   if (Array.isArray(payload)) {
//     return payload as Array<Record<string, unknown>>;
//   }

//   if (payload && typeof payload === "object") {
//     const maybeEvents = (payload as { events?: unknown; event?: unknown }).events;
//     const maybeEvent = (payload as { event?: unknown }).event;

//     if (Array.isArray(maybeEvents)) {
//       return maybeEvents as Array<Record<string, unknown>>;
//     }

//     if (maybeEvent && typeof maybeEvent === "object") {
//       return [maybeEvent as Record<string, unknown>];
//     }

//     return [payload as Record<string, unknown>];
//   }

//   return [];
// }

// const BackgroundWindow = () => {
//   const [desktop] = useWindow(DESKTOP, DISPLAY_OVERWOLF_HOOKS_LOGS);
//   const [ingame] = useWindow(INGAME, DISPLAY_OVERWOLF_HOOKS_LOGS);
//   const activeGameRef = useRef<{
//     classId: number;
//     title?: string;
//     slug?: string;
//   } | null>(null);
//   const onInfoUpdates = useCallback((info: any) => {
//     const gameInfo = (info as { gameInfo?: { classId?: number; title?: string } }).gameInfo;
//     if (gameInfo?.classId) {
//       activeGameRef.current = {
//         classId: gameInfo.classId,
//         title: gameInfo.title,
//         slug: getGameSlugFromTitle(gameInfo.title),
//       };
//     }

//     store.dispatch(
//       setInfo({
//         ...info,
//         timestamp: Date.now(),
//       }),
//     );
//   }, []);

//   const onNewEvents = useCallback((events: any) => {
//     log(
//       `onNewEvents received: ${JSON.stringify(events)}`,
//       "src/screens/background/components/Screen.tsx",
//       "onNewEvents",
//     );

//     store.dispatch(
//       setEvent({
//         ...events,
//         timestamp: Date.now(),
//       }),
//     );

//     const activeGame = activeGameRef.current;
//     if (!activeGame) {
//       log(
//         `Skipping event processing because active game is unknown`,
//         "src/screens/background/components/Screen.tsx",
//         "onNewEvents",
//       );
//       return;
//     }

//     for (const event of normalizeEvents(events)) {
//       const eventName = extractEventName(event);
//       if (!eventName) {
//         log(
//           `Skipping WS event without name: ${JSON.stringify(event)}`,
//           "src/screens/background/components/Screen.tsx",
//           "onNewEvents",
//         );
//         continue;
//       }

//       const payload = buildGameEventPayload({
//         gameId: activeGame.classId,
//         gameSlug: activeGame.slug,
//         eventName,
//         rawEvent: event,
//       });

//       if (!payload) {
//         log(
//           `Skipped unknown tracking event type: ${eventName}`,
//           "src/screens/background/components/Screen.tsx",
//           "onNewEvents",
//         );
//         continue;
//       }

//       wsClient.sendGameEvent(payload);
//     }
//   }, []);

//   // keep delegate stable across renders to avoid listener identity problems
//   const delegateRef = useRef({ onInfoUpdates, onNewEvents });
//   const { start, stop } = useGameEventProvider(delegateRef.current, REQUIRED_FEATURES, RETRY_TIMES, DISPLAY_OVERWOLF_HOOKS_LOGS);

//   const connectTracking = useCallback(async (reason: string) => {
//     try {
//       await wsClient.connect();
//       log(
//         reason,
//         "src/screens/background/components/Screen.tsx",
//         "connectTracking",
//       );
//     } catch (error) {
//       log(
//         `Failed to connect automatic tracking socket: ${error}`,
//         "src/screens/background/components/Screen.tsx",
//         "connectTracking",
//       );
//     }
//   }, []);

//   const initGameEvents = useCallback(
//     async (reason: string) => {
//       if (!desktop || !ingame) {
//         log(
//           `Cannot start GEP: desktop or ingame window not ready`,
//           "src/screens/background/components/Screen.tsx",
//           "initGameEvents",
//         );
//         return;
//       }

//       log(
//         `Initializing game event provider: ${reason}`,
//         "src/screens/background/components/Screen.tsx",
//         "initGameEvents",
//       );

//       // Explicitly request required features and log response for debugging
//       try {
//         overwolf.games.events.setRequiredFeatures(REQUIRED_FEATURES, (res: any) => {
//           log(
//             `setRequiredFeatures callback: ${JSON.stringify(res)}`,
//             "src/screens/background/components/Screen.tsx",
//             "initGameEvents",
//           );
//           if (res && (res.supportedFeatures || res.features)) {
//             const supported = res.supportedFeatures || res.features;
//             log(
//               `Supported features: ${JSON.stringify(supported)}`,
//               "src/screens/background/components/Screen.tsx",
//               "initGameEvents",
//             );
//           }
//         });
//       } catch (err) {
//         log(
//           `setRequiredFeatures threw: ${err}`,
//           "src/screens/background/components/Screen.tsx",
//           "initGameEvents",
//         );
//       }

//       await connectTracking(reason);
//       await start();

//       overwolf.games.events.getInfo((info) => {
//         log(
//           `GEP getInfo result: ${JSON.stringify(info)}`,
//           "src/screens/background/components/Screen.tsx",
//           "initGameEvents",
//         );
//       });
//     },
//     [connectTracking, desktop, ingame, start],
//   );

//   const startApp = useCallback(
//     async (reason: string) => {
//       if (!desktop || !ingame) return;
//       log(reason, "src/screens/background/components/Screen.tsx", "startApp");

//       const runningGame = await getRunningGameInfo();
//       if (runningGame) {
//         activeGameRef.current = {
//           classId: runningGame.classId,
//           title: (runningGame as any).title,
//           slug: getGameSlugFromTitle((runningGame as any).title),
//         };
//         await initGameEvents(reason);
//         await Promise.all([ingame?.restore(), desktop?.minimize()]);
//       } else {
//         activeGameRef.current = null;
//         wsClient.disconnect();
//         stop();
//         await desktop?.restore();
//       }
//     },
//     [desktop, ingame, initGameEvents, stop],
//   );

//   useEffect(() => {
//     const handler = (event: MessageEvent) => {
//       const data = event.data;

//       if (data?.type === "AUTH_SUCCESS") {
//         console.log("AUTH RECEIVED IN BACKGROUND");

//         tokenStorage.setTokens(data.accessToken, data.refreshToken);

//         wsClient
//           .connect()
//           .then(() => console.log("WS CONNECTED AFTER LOGIN"))
//           .catch(console.error);
//       }
//     };

//     window.addEventListener("message", handler);

//     return () => window.removeEventListener("message", handler);
//   }, []);

//   useEffect(() => {
//     const gameInfoUpdatedHandler = async (
//       event: overwolf.games.GameInfoUpdatedEvent,
//     ) => {
//       log(
//         `Game info updated: ${JSON.stringify(event)}`,
//         "src/screens/background/components/Screen.tsx",
//         "gameInfoUpdatedHandler",
//       );

//       if (event.runningChanged) {
//         if (event.gameInfo?.classId && event.gameInfo?.isRunning) {
//           activeGameRef.current = {
//             classId: event.gameInfo.classId,
//             title: event.gameInfo?.title,
//             slug: getGameSlugFromTitle(event.gameInfo?.title),
//           };

//           await initGameEvents("onGameInfoUpdated - game started");
//         } else {
//           activeGameRef.current = null;
//           wsClient.disconnect();
//           stop();
//           await desktop?.restore();
//         }

//         if (event.gameInfo?.classId) {
//           const payload = buildGameEventPayload({
//             gameId: event.gameInfo.classId,
//             gameSlug: getGameSlugFromTitle(event.gameInfo?.title),
//             eventName: "launch",
//             rawEvent: { action: "launch", gameName: event.gameInfo?.title },
//           });

//           if (payload) {
//             wsClient.sendEvent(payload);
//           }
//         }
//       }
//     };

//     const appLaunchTriggeredHandler = () => {
//       startApp("onAppLaunchTriggered");
//     };

//     const onErrorHandler = (error: any) => {
//       log(
//         `Overwolf GEP onError: ${JSON.stringify(error)}`,
//         "src/screens/background/components/Screen.tsx",
//         "onErrorHandler",
//       );
//     };

//     overwolf.games.onGameInfoUpdated.addListener(gameInfoUpdatedHandler);
//     overwolf.extensions.onAppLaunchTriggered.addListener(appLaunchTriggeredHandler);
//     overwolf.games.events.onError.addListener(onErrorHandler);

//     startApp("on initial load");

//     return () => {
//       overwolf.games.onGameInfoUpdated.removeListener(gameInfoUpdatedHandler);
//       overwolf.extensions.onAppLaunchTriggered.removeListener(appLaunchTriggeredHandler);
//       overwolf.games.events.onError.removeListener(onErrorHandler);
//       wsClient.disconnect();
//     };
//   }, [startApp, stop, initGameEvents, desktop]);

//   return null;
// };

// export default BackgroundWindow;

import {
  REQUIRED_FEATURES,
  RETRY_TIMES,
  DISPLAY_OVERWOLF_HOOKS_LOGS,
  WINDOW_NAMES,
} from "app/shared/constants";

import { useGameEventProvider, useWindow } from "overwolf-hooks";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { getRunningGameInfo } from "lib/games";
import {
  buildGameEventPayload,
  getGameSlugFromTitle,
} from "lib/gameEvents";

import { setInfo, setEvent } from "../stores/background";

import store from "app/shared/store";
import { log } from "lib/log";
import { wsClient } from "lib/wsClient";
import { tokenStorage } from "lib/tokenStorage";

const { DESKTOP, INGAME } = WINDOW_NAMES;

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

function extractEventName(event: any): string | null {
  if (!event) return null;

  return (
    event.name ??
    event.eventName ??
    event.event_name ??
    event.eventType ??
    event.event_type ??
    event.id ??
    event.event?.name ??
    event.event?.eventName ??
    event.event?.event_name ??
    event.event?.type ??
    event.event?.id ??
    null
  );
}

function normalizeEvents(payload: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(payload)) {
    return payload as any;
  }

  if (payload && typeof payload === "object") {
    const maybeEvents = (payload as any).events;
    const maybeEvent = (payload as any).event;

    if (Array.isArray(maybeEvents)) {
      return maybeEvents;
    }

    if (maybeEvent && typeof maybeEvent === "object") {
      return [maybeEvent];
    }

    return [payload as any];
  }

  return [];
}

/* -------------------------------------------------------------------------- */
/*                                 COMPONENT                                  */
/* -------------------------------------------------------------------------- */

const BackgroundWindow = () => {
  const [desktop] = useWindow(
    DESKTOP,
    DISPLAY_OVERWOLF_HOOKS_LOGS,
  );

  const [ingame] = useWindow(
    INGAME,
    DISPLAY_OVERWOLF_HOOKS_LOGS,
  );

  const activeGameRef = useRef<any>(null);

  /* ---------------------------------------------------------------------- */
  /*                              INFO UPDATES                              */
  /* ---------------------------------------------------------------------- */

  const onInfoUpdates = useCallback((info: any) => {
    log(
      `INFO UPDATE: ${JSON.stringify(info)}`,
      "Background",
      "onInfoUpdates",
    );

    const gameInfo = info?.gameInfo;

    if (gameInfo?.classId) {
      activeGameRef.current = {
        classId: gameInfo.classId,
        title: gameInfo.title,
        slug: getGameSlugFromTitle(gameInfo.title),
      };
    }

    store.dispatch(
      setInfo({
        ...info,
        timestamp: Date.now(),
      }),
    );
  }, []);

  /* ---------------------------------------------------------------------- */
  /*                               NEW EVENTS                               */
  /* ---------------------------------------------------------------------- */

  const onNewEvents = useCallback((events: any) => {
    log(
      `RAW GEP EVENTS: ${JSON.stringify(events)}`,
      "Background",
      "onNewEvents",
    );

    store.dispatch(
      setEvent({
        ...events,
        timestamp: Date.now(),
      }),
    );

    const activeGame = activeGameRef.current;

    if (!activeGame) {
      log(
        "No active game",
        "Background",
        "onNewEvents",
      );

      return;
    }

    const normalized = normalizeEvents(events);

    for (const event of normalized) {
      console.log("PARSED EVENT OBJECT", event);

      const eventName = extractEventName(event);

      if (!eventName) {
        log(
          "No event name found",
          "Background",
          "onNewEvents",
        );

        continue;
      }

      log(
        `Parsed event: ${eventName}`,
        "Background",
        "onNewEvents",
      );

      const payload = buildGameEventPayload({
        gameId: activeGame.classId,
        gameSlug: activeGame.slug,
        eventName,
        rawEvent: event,
      });

      if (!payload) {
        log(
          `No payload builder for ${eventName}`,
          "Background",
          "onNewEvents",
        );

        continue;
      }

      log(
        `Sending WS event: ${JSON.stringify(payload)}`,
        "Background",
        "onNewEvents",
      );

      wsClient.sendGameEvent(payload);
    }
  }, []);

  /* ---------------------------------------------------------------------- */
  /*                         FIXED PROVIDER CALLBACKS                       */
  /* ---------------------------------------------------------------------- */

  const provider = useMemo(
    () => ({
      onInfoUpdates,
      onNewEvents,
    }),
    [onInfoUpdates, onNewEvents],
  );

  /* ---------------------------------------------------------------------- */
  /*                              GEP PROVIDER                              */
  /* ---------------------------------------------------------------------- */

  const { start, stop } = useGameEventProvider(
    provider,
    REQUIRED_FEATURES,
    RETRY_TIMES,
    DISPLAY_OVERWOLF_HOOKS_LOGS,
  );

  /* ---------------------------------------------------------------------- */
  /*                              WS CONNECT                                */
  /* ---------------------------------------------------------------------- */

  const connectTracking = useCallback(async () => {
    try {
      await wsClient.connect();

      log(
        "WS CONNECTED",
        "Background",
        "ws-connect",
      );
    } catch (e) {
      log(
        `WS ERROR: ${e}`,
        "Background",
        "ws-connect",
      );
    }
  }, []);

  /* ---------------------------------------------------------------------- */
  /*                              RAW DEBUGGING                             */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const rawListener = (e: any) => {
      console.log(
        "DIRECT GEP EVENT",
        JSON.stringify(e, null, 2),
      );
    };

    overwolf.games.events.onNewEvents.addListener(
      rawListener,
    );

    return () => {
      overwolf.games.events.onNewEvents.removeListener(
        rawListener,
      );
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /*                             INITIALIZE GEP                             */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const init = async () => {
      try {
        log(
          "GLOBAL GEP INIT START",
          "Background",
          "init",
        );

        await connectTracking();

        const result = await start();

        log(
          `GEP START RESULT: ${JSON.stringify(result)}`,
          "Background",
          "init",
        );

        overwolf.games.events.getInfo((info) => {
          log(
            `GEP INFO: ${JSON.stringify(info)}`,
            "Background",
            "init",
          );
        });
      } catch (err) {
        log(
          `INIT ERROR: ${JSON.stringify(err)}`,
          "Background",
          "init",
        );
      }
    };

    init();

    return () => {
      log(
        "GLOBAL GEP STOP",
        "Background",
        "cleanup",
      );

      stop();
    };
  }, [start, stop, connectTracking]);

  /* ---------------------------------------------------------------------- */
  /*                                START APP                               */
  /* ---------------------------------------------------------------------- */

  const startApp = useCallback(async () => {
    if (!desktop || !ingame) {
      return;
    }

    const runningGame = await getRunningGameInfo();

    log(
      `RUNNING GAME: ${JSON.stringify(runningGame)}`,
      "Background",
      "startApp",
    );

    if (runningGame) {
      activeGameRef.current = {
        classId: runningGame.classId,
        title: (runningGame as any).title,
        slug: getGameSlugFromTitle(
          (runningGame as any).title,
        ),
      };

      await Promise.all([
        ingame.restore(),
        desktop.minimize(),
      ]);
    } else {
      activeGameRef.current = null;

      await desktop.restore();
    }
  }, [desktop, ingame]);

  /* ---------------------------------------------------------------------- */
  /*                                 AUTH                                   */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.data?.type === "AUTH_SUCCESS") {
        tokenStorage.setTokens(
          event.data.accessToken,
          event.data.refreshToken,
        );

        wsClient.connect().catch(console.error);
      }
    };

    window.addEventListener("message", handler);

    return () => {
      window.removeEventListener(
        "message",
        handler,
      );
    };
  }, []);

  /* ---------------------------------------------------------------------- */
  /*                           GAME STATE EVENTS                            */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const gameInfoUpdatedHandler = async (
      event: any,
    ) => {
      log(
        `GAME UPDATE: ${JSON.stringify(event)}`,
        "Background",
        "gameInfo",
      );

      /* -------------------------------------------------------------- */
      /* FIX #1 — HANDLE FOCUS CHANGES                                 */
      /* -------------------------------------------------------------- */

      if (event.focusChanged) {
        log(
          "FOCUS CHANGED -> RESTARTING GEP",
          "Background",
          "focus",
        );

        try {
          await stop();
          await start();
        } catch (err) {
          log(
            `FOCUS RESTART ERROR: ${JSON.stringify(err)}`,
            "Background",
            "focus",
          );
        }
      }

      /* -------------------------------------------------------------- */
      /* NORMAL GAME START/CLOSE                                        */
      /* -------------------------------------------------------------- */

      if (!event.runningChanged) {
        return;
      }

      if (event.gameInfo?.isRunning) {
        log(
          `GAME STARTED: ${event.gameInfo.title}`,
          "Background",
          "gameInfo",
        );

        activeGameRef.current = {
          classId: event.gameInfo.classId,
          title: event.gameInfo.title,
          slug: getGameSlugFromTitle(
            event.gameInfo.title,
          ),
        };

        /* ---------------------------------------------------------- */
        /* FIX #2 — RESTART GEP WHEN GAME STARTS                     */
        /* ---------------------------------------------------------- */

        try {
          await stop();
          await start();

          log(
            "GEP RESTARTED AFTER GAME START",
            "Background",
            "gameInfo",
          );
        } catch (err) {
          log(
            `GEP RESTART ERROR: ${JSON.stringify(err)}`,
            "Background",
            "gameInfo",
          );
        }

        await Promise.all([
          ingame?.restore(),
          desktop?.minimize(),
        ]);
      } else {
        log(
          "GAME CLOSED",
          "Background",
          "gameInfo",
        );

        activeGameRef.current = null;

        await desktop?.restore();
      }
    };

    const onLaunch = () => {
      log(
        "APP LAUNCH TRIGGERED",
        "Background",
        "launch",
      );

      startApp();
    };

    const onError = (e: any) => {
      log(
        `GEP ERROR: ${JSON.stringify(e)}`,
        "Background",
        "error",
      );
    };

    overwolf.games.onGameInfoUpdated.addListener(
      gameInfoUpdatedHandler,
    );

    overwolf.extensions.onAppLaunchTriggered.addListener(
      onLaunch,
    );

    overwolf.games.events.onError.addListener(
      onError,
    );

    startApp();

    return () => {
      overwolf.games.onGameInfoUpdated.removeListener(
        gameInfoUpdatedHandler,
      );

      overwolf.extensions.onAppLaunchTriggered.removeListener(
        onLaunch,
      );

      overwolf.games.events.onError.removeListener(
        onError,
      );
    };
  }, [
    startApp,
    desktop,
    ingame,
    start,
    stop,
  ]);

  return null;
};

export default BackgroundWindow;