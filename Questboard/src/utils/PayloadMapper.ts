// export function toGameEventRequest(event: any) {
//   return {
//     gameSlug: "valorant",
//     gameId: 21640,
//     eventType: event.feature ?? "UNKNOWN",
//     eventTimestamp: new Date().toISOString(),
//     count: 1,

import { GameEventRequest } from './GameEventRequest';

//     metadata: {
//       feature: event.feature,
//     },

//     rawData: event,
//   };
// }

export type NormalizedEventType =
  | 'kill'
  | 'death'
  | 'assist'
  | 'headshot'
  | 'spike_plant'
  | 'spike_defuse'
  | 'match_start'
  | 'match_end'
  | 'round_start'
  | 'round_end'
  | 'unknown';

// export function toGameEventRequest(event: any, gameClassId?: number) {
//   // const game = GAME_MAP[gameClassId];
//   const game = gameClassId ? GAME_MAP[gameClassId] : undefined;

//   return {
//     gameSlug: game?.slug ?? "unknown",
//     gameId: gameClassId,
//     eventType: event.feature ?? "UNKNOWN",
//     eventTimestamp: new Date().toISOString(),
//     count: 1,
//     metadata: {
//       feature: event.feature,
//     },
//     rawData: event,
//   };
// }

// export function toGameEventRequest(event: any, gameClassId?: number) {
//   const game = gameClassId ? GAME_MAP[gameClassId] : undefined;

//   const eventType = mapEventType(event);
//   const metadata = buildMetadata(event);

//   return {
//     gameSlug: game?.slug ?? 'unknown',
//     gameId: gameClassId ?? null,

//     // IMPORTANT: this is now your normalized event
//     eventType,

//     // always 1 per event emission
//     count: 1,

//     eventTimestamp: new Date().toISOString(),

//     metadata,

//     // keep raw for debugging only (can remove later in prod)
//     rawData: event,
//   };
// }

function safeParse(data: any) {
  try {
    return typeof data === 'string' ? JSON.parse(data) : data;
  } catch {
    return data;
  }
}

// export function toGameEventRequest(
//   event: any,
//   gameContext?: { gameId?: number; gameSlug?: string }
// ) {
//   const raw = event?.data ? safeParse(event.data) : event;

//   const eventType = (event?.name || event?.feature || "unknown").toLowerCase();

//   return {
//     gameId: gameContext?.gameId ?? null,
//     gameSlug: gameContext?.gameSlug ?? "unknown",
//     gameName: gameContext?.gameSlug ?? "unknown",

//     eventType,

//     eventTimestamp: new Date().toISOString(),

//     count: 1,

//     metadata: {
//       map: raw?.map ?? null,
//       agent: raw?.agent ?? raw?.attacker ?? null,
//       weapon: raw?.weapon ?? null,
//       headshot: raw?.headshot ?? null,
//       assists: [
//         raw?.assist1,
//         raw?.assist2,
//         raw?.assist3,
//         raw?.assist4,
//       ].filter(Boolean),
//     },

//     rawData: event,
//   };
// }

// export function toGameEventRequest(
//   event: any,
//   gameContext: any
// ): GameEventRequest {
//   return {
//     userId: gameContext.userId,
//     gameId: gameContext.gameId,
//     gameSlug: gameContext.gameName, // e.g. "valorant"

//     eventType: event.type,

//     eventTimestamp: new Date().toISOString(),

//     count: 1,

//     metadata: {
//       ...event.metadata,
//     },

//     rawData: {
//       ...event.rawData,
//     },
//   };
// }

export function toGameEventRequest(
  event: any,
  gameContext: any,
): GameEventRequest {
  return {
    userId: gameContext.userId,
    gameId: gameContext.gameId,
    gameSlug: gameContext.gameSlug,

    eventType: event.eventType,

    eventTimestamp: new Date().toISOString(),

    count: event.count ?? 1,

    metadata: buildMetadata(event),

    rawData: event.rawData,
  };
}

// function buildMetadata(event: any) {
//   let parsedData = event.data;

//   // handle stringified JSON safely
//   if (typeof parsedData === 'string') {
//     try {
//       parsedData = JSON.parse(parsedData);
//     } catch {
//       // keep as-is (kills = "35")
//     }
//   }

//   return {
//     feature: event.feature,
//     key: event.key,
//     category: event.category,
//     data: parsedData,

//     // optionally enrich later:
//     map: parsedData?.map ?? null,
//     agent: parsedData?.character ?? null,
//     weapon: parsedData?.weapon ?? null,
//     headshot: parsedData?.headshot ?? null,
//     assists:
//       parsedData?.assists ?? parsedData?.assist1 ?? parsedData?.assist2 ?? null,
//   };
// }

function buildMetadata(event: any) {
  const rawData = event.rawData ?? {};

  return {
    ...(event.metadata ?? {}),

    agent: event.agent ?? null,

    headshot: rawData.headshot ?? event.metadata?.headshot ?? null,
  };
}

// function mapEventType(event: any): NormalizedEventType {
//   switch (event.feature) {
//     case 'kill':
//       if (event.key === 'headshots') return 'headshot';
//       return 'kill';

//     case 'death':
//       return 'death';

//     case 'match_info':
//       if (event.key === 'round_phase') {
//         if (event.data === 'game_end') return 'match_end';
//         if (event.data === 'start') return 'match_start';
//       }

//       if (event.key === 'spike') return 'spike_plant';

//       return 'unknown';

//     case 'game_info':
//       if (event.key === 'state' && event.data === 'WaitingPostMatch') {
//         return 'match_end';
//       }
//       return 'unknown';

//     default:
//       return 'unknown';
//   }
// }

function mapEventType(
  killFeed: any,
  localPlayerName: string,
): NormalizedEventType {
  if (killFeed.attacker === localPlayerName) {
    return 'kill';
  }

  if (killFeed.victim === localPlayerName) {
    return 'death';
  }

  return 'unknown';
}

export function createKillFeedEvent(
  killFeed: any,
  gameContext: any,
  localPlayer: any,
): GameEventRequest | null {
  const eventType = mapEventType(killFeed, localPlayer.name);

  if (eventType === 'unknown') {
    return null;
  }

  return toGameEventRequest(
    {
      eventType,

      agent: localPlayer.agent,

      metadata: {
        headshot: killFeed.headshot,
      },

      rawData: killFeed,
    },

    gameContext,
  );
}

const GAME_MAP: Record<number, { slug: string; id: number }> = {
  21640: {
    slug: 'valorant',
    id: 21640,
  },
  7764: {
    slug: 'league-of-legends',
    id: 7764,
  },
  5426: {
    slug: 'cs2',
    id: 5426,
  },
};
