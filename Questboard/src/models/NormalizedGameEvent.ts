export interface NormalizedGameEvent {
  eventType: 'KILL' | 'DEATH' | 'ASSIST' | 'MATCH_WIN' | 'DAMAGE';

  count : number;

  gameId?: number;

  gameSlug?: string;

  timestamp: string;

  metadata?: Record<string, any>;

  rawData?: any;
}