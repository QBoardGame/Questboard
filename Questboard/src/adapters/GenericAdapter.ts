import { GameAdapter } from './GameAdapter';
import { GameState } from '../models/GameState';
import { NormalizedGameEvent } from '../models/NormalizedGameEvent';

export class GenericAdapter implements GameAdapter {
  protected state: GameState = {
    localPlayer: {
      name: '',
    },
  };

  protected pendingEvents: NormalizedGameEvent[] = [];

  handleInfoUpdate(_: any): void {}

  handleGameEvent(_: any): void {}

  consumePendingEvents(): NormalizedGameEvent[] {
    const events = [...this.pendingEvents];

    this.pendingEvents = [];

    return events;
  }

  getGameState(): GameState {
    return this.state;
  }
}