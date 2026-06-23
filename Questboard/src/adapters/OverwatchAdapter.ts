import { GenericAdapter } from './GenericAdapter';

export class OverwatchAdapter extends GenericAdapter {
  private metadata: Record<string, any> = {};
  private hasSentWin = false;
  private lastDamage = 0;

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

  /**
   * ONLY state + metadata updates here
   */
  handleInfoUpdate(event: any): void {
    console.log('OV info update: ' + JSON.stringify(event, null, 2));
    const info = event?.info;

    if (!info) return;

    if (info?.game_info?.game_state === 'match_ended') {
      console.log('[OverwatchAdapter] Match ended, resetting counters');

      this.lastDamage = 0;
      this.hasSentWin = false; // if you reuse this for the next match
    }

    /**
     * Local player (battle tag)
     */
    if (info?.game_info?.battle_tag) {
      this.state.localPlayer.name = info.game_info.battle_tag;
    }

    /**
     * Current map
     */
    if (info?.match_info?.map) {
      this.state.localPlayer.map = String(info.match_info.map);
    }

    if (info?.roster) {
      this.processRoster(info.roster);
    }

    /**
     * Track ALL metadata except noisy fields
     */
    const safeAssign = (obj: any) => {
      Object.entries(obj || {}).forEach(([key, value]) => {
        if (key === 'kill_feed' || key === 'battle_tag') return;

        this.metadata[key] = value;
      });
    };

    safeAssign(info.match_info);
    safeAssign(info.game_info);

    /**
     * WIN EVENT (ONLY ONCE)
     */
    if (info?.match_info?.match_outcome === 'victory' && !this.hasSentWin) {
      this.hasSentWin = true;

      this.pendingEvents.push({
        eventType: 'MATCH_WIN',
        count: 1,
        timestamp: new Date().toISOString(),

        metadata: {
          map: this.state.localPlayer.map,
          agent: this.state.localPlayer.character,
          mode: this.metadata.game_mode,
          gameType: this.metadata.game_type,
          match_outcome: 'victory',
        },

        rawData: info,
      });
    }
  }

  /**
   * ONLY event parsing here
   */
  handleGameEvent(event: any): void {
    if (!event?.events) return;

    for (const gameEvent of event.events) {
      switch (gameEvent.name) {
        case 'kill_feed':
          this.processKillFeed(gameEvent.data);
          break;

        case 'assist':
          this.processAssist(gameEvent.data);
          break;
      }
    }
  }

  private processAssist(raw: string): void {
    try {
      const assistCount = typeof raw === 'string' ? Number(raw) : raw;

      this.pendingEvents.push({
        eventType: 'ASSIST',
        count: assistCount || 1,
        timestamp: new Date().toISOString(),

        metadata: {
          map: this.state.localPlayer.map,
          agent: this.state.localPlayer.character,
          mode: this.metadata.game_mode,
          gameType: this.metadata.game_type,
          match_outcome: this.metadata.match_outcome,
        },

        rawData: raw,
      });
    } catch (err) {
      console.error('[OverwatchAdapter][assist_parse_error]', err, raw);
    }
  }

  private processKillFeed(raw: string): void {
    try {
      const killFeed = typeof raw === 'string' ? JSON.parse(raw) : raw;

      const localPlayer = this.getLocalPlayerName();

      const attacker = this.normalizePlayerName(killFeed.attacker);

      const isMyKill = attacker === localPlayer;

      if (!isMyKill) return;

      /**
       * Use CURRENT hero from state (safe for mid-game swaps)
       */
      this.pendingEvents.push({
        eventType: 'KILL',
        count: 1,
        timestamp: new Date().toISOString(),

        metadata: {
          map: this.state.localPlayer.map,
          agent: this.state.localPlayer.character,
          mode: this.metadata.game_mode,
          gameType: this.metadata.game_type,

          victimHero: killFeed.victim_hero_name,
          attackerHero: killFeed.attacker_hero_name,
          match_outcome: this.metadata.match_outcome,
        },

        rawData: killFeed,
      });
    } catch (err) {
      console.error('[OverwatchAdapter][kill_feed_parse_error]', err, raw);
    }
  }

  private processRoster(roster: Record<string, string>): void {
    for (const value of Object.values(roster)) {
      const player = JSON.parse(value);

      if (!player.is_local) continue;

      const totalDamage = Math.floor(player.damage || 0);

      const delta = totalDamage - this.lastDamage;

      if (delta > 0) {
        this.pendingEvents.push({
          eventType: 'DAMAGE',
          count: delta, // this becomes event.value
          timestamp: new Date().toISOString(),
          metadata: {
            map: this.state.localPlayer.map,
            agent: player.hero_name,
          },
        });
      }

      this.lastDamage = totalDamage;
      break;
    }
  }
}
