export interface GameEventRequest {
  userId: string;
  gameId: number;
  gameSlug: string;

  eventType: string;
  eventTimestamp: string;

  count: number;

  metadata: Record<string, any>;
  rawData: Record<string, any>;
}