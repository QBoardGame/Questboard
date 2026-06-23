import { GenericAdapter } from './GenericAdapter';

export class ValorantAdapter extends GenericAdapter {
  private normalizePlayerName(name?: string): string {
    if (!name) return '';

    return name
      .replace(/\s*#.*$/, '')
      .trim()
      .toLowerCase();
  }

  private getLocalPlayerName(): string {
    return this.normalizePlayerName(this.state.localPlayer.name);
  }

  handleInfoUpdate(event: any): void {
    const info = event?.info;

    if (info?.me?.player_name) {
      this.state.localPlayer.name = info.me.player_name;
    }

    if (info?.match_info?.map) {
      this.state.localPlayer.map = info.match_info.map;
    }

    if (
      info?.match_info?.match_outcome &&
      String(info.match_info.match_outcome).toLowerCase() === 'victory'
    ) {
      this.pendingEvents.push({
        eventType: 'MATCH_WIN',
        count: 1,
        timestamp: new Date().toISOString(),
        metadata: {
          map: this.state.localPlayer.map,
          agent: this.state.localPlayer.character,
          weapon: this.state.localPlayer.weapon,
        },
        rawData: {
          outcome: info.match_info.match_outcome,
        },
      });

      console.log('[MATCH WON]');
    }

    if (!info?.match_info) return;

    for (const [key, value] of Object.entries(info.match_info)) {
      try {
        const player = JSON.parse(value as string);

        /**
         * ✅ SUPPORT OLD FORMAT
         */
        const isLocalOld = player.is_local === true;

        /**
         * ✅ SUPPORT NEW FORMAT (your case)
         */
        const isLocalNew = player.local === true;

        const isLocal = isLocalOld || isLocalNew;

        if (!isLocal) continue;

        this.state.localPlayer.name =
          player.name ?? this.state.localPlayer.name;

        this.state.localPlayer.character = player.character;
        this.state.localPlayer.weapon = player.weapon;

        console.log('[LOCAL PLAYER DETECTED]', player);
      } catch (err) {
        console.warn('[ValorantAdapter][player_parse_error]', err);
      }
    }

    // if (info?.match_info?.kill_feed) {
    //   this.processKillFeed(info.match_info.kill_feed);
    // }
  }

  handleGameEvent(event: any): void {
    if (!event?.events) return;

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
      const victim = this.normalizePlayerName(killFeed.victim);

      const isMyKill = attacker === localPlayer;
      const isMyDeath = victim === localPlayer;

      // ❌ Ignore deaths completely (no backend event)
      if (!isMyKill) return;

      this.pendingEvents.push({
        eventType: 'KILL',
        count: 1,

        timestamp: new Date().toISOString(),

        metadata: {
          weapon: killFeed.weapon,
          headshot: killFeed.headshot,
          map: this.state.localPlayer.map,
          agent: this.state.localPlayer.character,
        },

        rawData: killFeed,
      });
    } catch (err) {
      console.error('[ValorantAdapter][kill_feed_parse_error]', err, raw);
    }
  }
}
