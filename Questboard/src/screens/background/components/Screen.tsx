import {
  REQUIRED_FEATURES,
  WINDOW_NAMES,
  RETRY_TIMES,
  DISPLAY_OVERWOLF_HOOKS_LOGS,
} from "app/shared/constants";
import { useGameEventProvider, useWindow } from "overwolf-hooks";
import { useCallback, useEffect, useRef } from "react";
import { getRunningGameInfo } from "lib/games";
import { setInfo, setEvent } from "../stores/background";
import store from "app/shared/store";
import { log } from "lib/log";
import { wsClient } from "lib/wsClient";

const { DESKTOP, INGAME } = WINDOW_NAMES;

type TrackingEventType = "KILL" | "ASSIST" | "DEATH" | "MATCH_WIN" | "DAMAGE" | "PLAYTIME" | "MATCH_PLAYED";

function extractEventName(event: any): string | null {
  if (!event) {
    return null;
  }

  return (
    event.name ??
    event.eventName ??
    event.event_name ??
    event.type ??
    event.id ??
    null
  );
}

function mapTrackingEventType(eventName: string): TrackingEventType | null {
  const normalized = eventName.toLowerCase();

  if (normalized.includes("kill")) return "KILL";
  if (normalized.includes("assist")) return "ASSIST";
  if (normalized.includes("death") || normalized.includes("died")) return "DEATH";
  if (normalized.includes("win")) return "MATCH_WIN";
  if (normalized.includes("damage")) return "DAMAGE";
  if (normalized.includes("play") || normalized.includes("launch")) return "PLAYTIME";

  return null;
}

function normalizeEvents(payload: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(payload)) {
    return payload as Array<Record<string, unknown>>;
  }

  if (payload && typeof payload === "object") {
    const maybeEvents = (payload as { events?: unknown }).events;

    if (Array.isArray(maybeEvents)) {
      return maybeEvents as Array<Record<string, unknown>>;
    }

    return [payload as Record<string, unknown>];
  }

  return [];
}

const BackgroundWindow = () => {
  const [desktop] = useWindow(DESKTOP, DISPLAY_OVERWOLF_HOOKS_LOGS);
  const [ingame] = useWindow(INGAME, DISPLAY_OVERWOLF_HOOKS_LOGS);
  const activeGameIdRef = useRef<number | null>(null);
  const { start, stop } = useGameEventProvider(
    {
      onInfoUpdates: (info) =>
        {
          const gameInfo = (info as { gameInfo?: { classId?: number } }).gameInfo;
          if (gameInfo?.classId) {
            activeGameIdRef.current = gameInfo.classId;
          }

          store.dispatch(
            setInfo({
              ...info,
              timestamp: Date.now(),
            })
          );
        },
      onNewEvents: (events) => {
        store.dispatch(
          setEvent({
            ...events,
            timestamp: Date.now(),
          })
        );

        const gameId = activeGameIdRef.current;
        if (!gameId) {
          return;
        }

        for (const event of normalizeEvents(events)) {
          const eventName = extractEventName(event);
          if (!eventName) {
            continue;
          }

          const eventType = mapTrackingEventType(eventName);
          if (!eventType) {
            continue;
          }

          wsClient.sendEvent({
            gameId,
            eventType,
            eventTimestamp: new Date().toISOString(),
            rawData: event,
          });
        }
      },
    },
    REQUIRED_FEATURES,
    RETRY_TIMES,
    DISPLAY_OVERWOLF_HOOKS_LOGS
  );

  const connectTracking = useCallback(async (reason: string) => {
    try {
      await wsClient.connect();
      log(reason, "src/screens/background/components/Screen.tsx", "connectTracking");
    } catch (error) {
      log(
        `Failed to connect automatic tracking socket: ${error}`,
        "src/screens/background/components/Screen.tsx",
        "connectTracking"
      );
    }
  }, []);

  const startApp = useCallback(
    async (reason: string) => {
      if (!desktop || !ingame) return;
      log(reason, "src/screens/background/components/Screen.tsx", "startApp");

      const runningGame = await getRunningGameInfo();
      if (runningGame) {
        activeGameIdRef.current = runningGame.classId;
        await Promise.all([connectTracking(reason), start(), ingame?.restore(), desktop?.minimize()]);
      } else {
        activeGameIdRef.current = null;
        wsClient.disconnect();
        await Promise.all([stop(), desktop?.restore()]);
      }
    },
    [connectTracking, desktop, ingame, start, stop]
  );

  useEffect(() => {
    startApp("on initial load");
    const gameInfoUpdatedHandler = async (event: overwolf.games.GameInfoUpdatedEvent) => {
      if (event.runningChanged) {
        if (event.gameInfo?.classId) {
          activeGameIdRef.current = event.gameInfo.classId;
        }

        await startApp("onGameInfoUpdated");

        if (event.runningChanged && event.gameInfo?.classId) {
          wsClient.sendEvent({
            gameId: event.gameInfo.classId,
            eventType: "PLAYTIME",
            eventTimestamp: new Date().toISOString(),
            rawData: { action: "launch", gameName: event.gameInfo?.title },
          });
        }
      }
    };

    overwolf.games.onGameInfoUpdated.addListener(gameInfoUpdatedHandler);
    overwolf.extensions.onAppLaunchTriggered.addListener(() => {
      startApp("onAppLaunchTriggered");
    });
    return () => {
      overwolf.games.onGameInfoUpdated.removeListener(gameInfoUpdatedHandler);
      overwolf.extensions.onAppLaunchTriggered.removeListener(() => {});
      wsClient.disconnect();
    };
  }, [startApp]);

  return null;
};

export default BackgroundWindow;
