export function toGameEventRequest(event: any) {
  return {
    gameSlug: "valorant",
    gameId: 21640,
    eventType: event.feature ?? "UNKNOWN",
    eventTimestamp: new Date().toISOString(),
    count: 1,

    metadata: {
      feature: event.feature,
    },

    rawData: event,
  };
}