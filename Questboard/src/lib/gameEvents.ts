import { GAMES } from "data/games";

export type GameEventPayload = {
  gameId: number;
  gameSlug?: string;
  eventType: string;
  count: number;
  metadata: Record<string, unknown>;
  eventTimestamp: string;
  rawData?: unknown;
};

export function getGameSlugFromTitle(title?: string): string | undefined {
  if (!title) {
    return undefined;
  }

  const normalizedTitle = title.trim().toLowerCase();

  return (
    GAMES.find(
      (game) =>
        game.slug.toLowerCase() === normalizedTitle || game.title.toLowerCase() === normalizedTitle
    )?.slug
  );
}

export function mapTrackingEventType(eventName: string): string | null {
  const normalized = eventName.trim().toLowerCase();

  // Match_info events (Valorant-specific)
  if (normalized === "kill_feed" || normalized.includes("killfeed")) return "KILL";
  if (normalized === "match_start" || (normalized.includes("match") && normalized.includes("start"))) return "MATCH_WIN";
  if (normalized === "match_end" || (normalized.includes("match") && normalized.includes("end"))) return "MATCH_WIN";
  if (normalized === "spike_detonated" || (normalized.includes("spike") && normalized.includes("detonated"))) return "OBJECTIVE_CAPTURE";
  if (normalized === "spike_defused" || (normalized.includes("spike") && normalized.includes("defused"))) return "SPIKE_DEFUSE";
  if (normalized === "spike_plant" || normalized === "planted_location") return "SPIKE_PLANT";
  
  // Kill/Death feature events (Valorant-specific)
  if (normalized === "kill" || normalized === "kills") return "KILL";
  if (normalized === "assist" || normalized === "assists") return "ASSIST";
  if (normalized === "death" || normalized === "deaths") return "DEATH";
  if (normalized === "headshot" || normalized === "headshots") return "HEADSHOT";
  
  // Generic event mappings
  if (normalized.includes("headshot")) return "HEADSHOT";
  if (normalized.includes("first blood") || normalized.includes("firstblood")) return "FIRST_BLOOD";
  if (normalized.includes("clutch")) return "CLUTCH_WIN";
  if (normalized.includes("ace")) return "ACE";
  if (normalized.includes("objective") || normalized.includes("capture")) return "OBJECTIVE_CAPTURE";
  if (normalized.includes("mvp")) return "MVP";
  if (normalized.includes("top fragger") || normalized.includes("topfrag")) return "TOP_FRAGGER";
  if (normalized.includes("draw")) return "DRAW";
  if (normalized.includes("match loss") || normalized.includes("loss")) return "MATCH_LOSS";
  if (normalized.includes("match win") || normalized.includes("win")) return "MATCH_WIN";
  if (normalized.includes("damage")) return "DAMAGE";
  if (normalized.includes("play") || normalized.includes("launch")) return "PLAYTIME";

  return null;
}

function extractNumericValue(eventData: Record<string, unknown>): number | undefined {
  const candidates = ["count", "value", "kills", "assists", "damage", "deaths", "score", "amount", "seconds", "minutes"];

  for (const key of candidates) {
    const value = eventData[key];

    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }

    if (typeof value === "string" && /^\d+$/.test(value)) {
      return Number(value);
    }
  }

  return undefined;
}

function estimateCount(eventType: string, eventData: Record<string, unknown>): number {
  const count = extractNumericValue(eventData);

  if (count !== undefined) {
    return count;
  }

  if (eventType === "DAMAGE") {
    return 1;
  }

  return 1;
}

function extractMetadata(rawEvent: Record<string, unknown>): Record<string, unknown> {
  const metadataKeys = [
    "map",
    "character",
    "gun",
    "weapon",
    "mode",
    "player",
    "team",
    "round",
    "matchId",
    "rank",
    "location",
    "zone",
    "score",
    "damage",
    "kills",
    "assists",
    "deaths",
  ];

  const metadata: Record<string, unknown> = {};

  for (const key of metadataKeys) {
    if (rawEvent[key] !== undefined) {
      metadata[key] = rawEvent[key];
    }
  }

  if (Object.keys(metadata).length > 0) {
    return metadata;
  }

  return { raw: rawEvent };
}

export function buildGameEventPayload(options: {
  gameId: number;
  eventName: string;
  rawEvent: unknown;
  gameSlug?: string;
}): GameEventPayload | null {
  const eventType = mapTrackingEventType(options.eventName);
  if (!eventType) {
    return null;
  }

  const rawEventObject =
    options.rawEvent && typeof options.rawEvent === "object"
      ? (options.rawEvent as Record<string, unknown>)
      : {};

  return {
    gameId: options.gameId,
    gameSlug: options.gameSlug,
    eventType,
    count: estimateCount(eventType, rawEventObject),
    metadata: extractMetadata(rawEventObject),
    eventTimestamp: new Date().toISOString(),
    rawData: rawEventObject,
  };
}
