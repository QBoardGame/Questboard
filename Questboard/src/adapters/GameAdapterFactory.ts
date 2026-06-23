import { GameAdapter } from './GameAdapter';
import { GenericAdapter } from './GenericAdapter';
import { OverwatchAdapter } from './OverwatchAdapter';
import { ValorantAdapter } from './ValorantAdapter';
import { ApexLegendsAdapter } from './ApexLegendsAdapter';
import { CounterStrike2Adapter } from "./CounterStrike2";

export class GameAdapterFactory {
  static create(gameId?: number): GameAdapter {
    switch (gameId) {
      case 21640:
        return new ValorantAdapter();

      case 10844:
        return new OverwatchAdapter();

      case 21566:
        return new ApexLegendsAdapter();

      case 22730:
        return new CounterStrike2Adapter();

      default:
        return new GenericAdapter();
    }
  }
}