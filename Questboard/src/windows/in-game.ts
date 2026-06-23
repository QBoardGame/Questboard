import 'reflect-metadata';
import { DependencyContainer, container, inject, injectable } from 'tsyringe';
import {
  CommunicationConnectorServiceBase,
  CommunicationConnectorToken,
} from '../types/services/communication-connector-service-base';
import { CommunicationConnectorService } from '../overwolf-platform/services/communication-connector-service';
import {
  GEPEnabledFeatures,
  GEPServiceBase,
  GEPToken,
} from '../types/services/gep-service-base';
import { GEPConsumer } from '../overwolf-platform/consumers/gep-consumer';
import { gameEventsWSBridge } from '../shared/GameEventsWSBridge';
import { GameAdapter } from '../adapters/GameAdapter';
import { GameAdapterFactory } from '../adapters/GameAdapterFactory';
// import { toGameEventRequest } from '../utils/PayloadMapper';

container.register(CommunicationConnectorToken, CommunicationConnectorService);

// -----------------------------------------------------------------------------
@injectable()
export class Main {
  public constructor(
    private readonly gepConsumer: GEPConsumer,
    @inject(CommunicationConnectorToken)
    private readonly communicationConnector: CommunicationConnectorServiceBase,
  ) {
    this.init();
  }

  private gepService: GEPServiceBase | undefined;
  private adapter?: GameAdapter;
  private currentAdapterGameId?: number;

  private gameContext: {
    gameId?: number;
    gameSlug?: string;
    gameName?: string;
  } = {};

  private logEnabledFeatures(features: GEPEnabledFeatures): void {
    const failed = features.requested.filter(
      (value) => !features.enabled.includes(value),
    );
    console.log(
      `
Attempted to subscribe to the following features: ${JSON.stringify(
        features.requested,
        undefined,
        4,
      )}
Successfully subscribed to the following features: ${JSON.stringify(
        features.enabled,
        undefined,
        4,
      )}
Failed to subscribe to ${failed.length} features: ${JSON.stringify(
        failed,
        undefined,
        4,
      )}
      `,
    );
  }

  private connectionReceivedListener(mainContainer: DependencyContainer) {
    console.log(
      '[in-game][connectionReceivedListener] Initializing GEP listeners',
    );

    this.gepService = mainContainer.resolve<GEPServiceBase>(GEPToken);

    console.log('[in-game][connectionReceivedListener] GEP service resolved');

    if (!this.gepService.getEnabledFeatures()) {
      this.gepService.once('enabledFeatures', (features) => {
        this.logEnabledFeatures(features);
      });
    } else {
      console.log(
        '[in-game][connectionReceivedListener] Features already available',
      );

      this.logEnabledFeatures(this.gepService.getEnabledFeatures());
    }

    this.gepService.on('gameEvent', (event) => {
      this.gepConsumer.onNewGameEvent(event);

      console.log(
        '[in-game][gameEvent] Payload:',
        JSON.stringify(event, null, 2),
      );

      if (!this.adapter) {
        console.warn('[in-game][gameEvent] Adapter not initialized yet');
        return;
      }

      // 1. Let adapter process real-time event
      this.adapter.handleGameEvent(event);

      // 2. Flush pending normalized events (ONLY HERE)
      const pendingEvents = this.adapter.consumePendingEvents();

      pendingEvents.forEach((normalizedEvent) => {
        const payload = {
          ...normalizedEvent,
          gameId: this.gameContext.gameId,
          gameSlug: this.gameContext.gameSlug,
        };

        console.log(
          '[GAME_EVENT][WEBSOCKET] Sending:',
          JSON.stringify(payload, null, 2),
        );

        gameEventsWSBridge.send({
          type: 'GAME_EVENT',
          payload,
        });
      });
    });

    this.gepService.on('infoUpdate', (event) => {
      this.gepConsumer.onGameInfoUpdate(event);

      const info: any = event?.info;

      if ('classId' in event && typeof (event as any).classId === 'number') {
        this.gameContext.gameId = (event as any).classId;
      }

      if (info?.game_info?.slug) {
        this.gameContext.gameSlug = info.game_info.slug;
      }

      if (info?.game_info?.name) {
        this.gameContext.gameName = info.game_info.name;
      }

      if (
        this.gameContext.gameId &&
        this.currentAdapterGameId !== this.gameContext.gameId
      ) {
        this.adapter = GameAdapterFactory.create(this.gameContext.gameId);
        this.currentAdapterGameId = this.gameContext.gameId;

        console.log(
          `[GAME_ADAPTER] Switched to game ${this.gameContext.gameId}`,
        );
      }

      // ONLY update state
      this.adapter?.handleInfoUpdate(event);
    });

    this.gepService.on('error', (event) => {
      console.error(
        '[in-game][error] GEP error:',
        JSON.stringify(event, null, 2),
      );

      this.gepConsumer.onGEPError(event);

      gameEventsWSBridge.send({
        type: 'GEP_ERROR',
        payload: event,
      });

      console.log('[in-game][error] Error forwarded to WebSocket bridge');
    });
  }

  private messageReceivedListener = (message: any) => {
    if (message?.type === 'GAME_CONTEXT') {
      this.gameContext = {
        gameId: message.payload.gameId,
        gameSlug: message.payload.gameSlug,
        gameName: message.payload.gameName,
      };
    }
  };

  private connectionStoppedListener() {
    if (this.gepService) {
      this.gepService.off('gameEvent', this.gepConsumer.onNewGameEvent);
      this.gepService.off('infoUpdate', this.gepConsumer.onGameInfoUpdate);
      this.gepService.off('error', this.gepConsumer.onGEPError);
    }

    this.communicationConnector.off(
      'messageReceived',
      this.messageReceivedListener,
    );
  }

  /**
   * Initializes this app
   */
  public init(): void {
    this.communicationConnector.once(
      'connectionReceived',
      (container: DependencyContainer) =>
        this.connectionReceivedListener(container),
    );

    this.communicationConnector.on(
      'messageReceived',
      this.messageReceivedListener,
    );

    this.communicationConnector.once('connectionStopped', () =>
      this.connectionStoppedListener(),
    );

    this.communicationConnector.connectToMain(
      'in-game',
      this.communicationConnector,
    );
  }

  private pendingEvent: {
    eventType?: 'KILL';
    headshot?: boolean;
    weapon?: string;
    rawData?: any;
  } | null = null;
}

container.resolve(Main);
