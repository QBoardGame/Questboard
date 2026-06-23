import { GenericAdapter } from './GenericAdapter';

export class CounterStrike2Adapter extends GenericAdapter {
  private roster: Record<string, any> = {};
  private normalizePlayerName(name?: string): string {
    if (!name) return '';

    return name.trim().toLowerCase();
  }

  private getLocalPlayerName(): string {
    return this.normalizePlayerName(this.state.localPlayer.name);
  }

  handleInfoUpdate(event: any): void {
    console.log('[CS2] Info Update: ' + JSON.stringify(event, null, 2));
    const info = event?.info;

    const matchInfo = info?.match_info;
    if (!matchInfo) return;

    for (const [key, value] of Object.entries(matchInfo)) {
      if (!key.startsWith('roster_')) continue;

      let player;

      try {
        player = typeof value === 'string' ? JSON.parse(value) : value;
      } catch {
        continue;
      }

      const isLocal =
        player.is_local === true ||
        player.is_local === 'true' ||
        player.local === true;

      if (!isLocal) continue;

      this.state.localPlayer.name = player.nickname;
      this.state.localPlayer.team = player.team;

    }
  }

  handleGameEvent(event: any): void {
    console.log('[CS2] handleGameEvent', JSON.stringify(event, null, 2));

    if (!event?.events) {
      console.log('[CS2] No events array');
      return;
    }

    for (const gameEvent of event.events) {

      if (gameEvent.name !== 'kill_feed') continue;

      this.processKillFeed(gameEvent.data);
    }
  }

  private processKillFeed(raw: string): void {
    try {
      const killFeed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      const localPlayer = this.getLocalPlayerName();
      const attacker = this.normalizePlayerName(killFeed.attacker);


      if (attacker !== localPlayer) {
        console.log('[CS2] attacker mismatch', attacker, localPlayer);
        return;
      }

      console.log('[CS2] MATCHED LOCAL PLAYER');

      this.pendingEvents.push({
        eventType: 'KILL',
        count: 1,
        timestamp: new Date().toISOString(),

        metadata: {
          weapon: killFeed.weapon,
          headshot: killFeed.headshot,
          map: this.state.localPlayer.map,
        },

        rawData: killFeed,
      });

      console.log('[CS2] Queued KILL event', JSON.stringify(killFeed, null, 2));
    } catch (err) {
      console.error('[CS2][kill_feed_parse_error]', err, raw);
    }
  }
}
