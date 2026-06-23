import { GameState } from '../models/GameState';
import { NormalizedGameEvent } from '../models/NormalizedGameEvent';

export interface GameAdapter {
  handleInfoUpdate(event: any): void;

  handleGameEvent(event: any): void;

  consumePendingEvents(): NormalizedGameEvent[];

  getGameState(): GameState;
}