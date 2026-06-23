import { useEffect, useMemo, useState } from 'react';
import { GAMES, GameInfo } from '../../constants/games';
import {
  getGameChallenges,
  UserChallengeProgressDto,
} from '../../lib/challenges';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/store';

const ITEMS_PER_ROW = 4;

const challengePoints = (challenge: UserChallengeProgressDto) => {
  const progress = challenge.progress ?? 0;
  const target = challenge.targetValue || 1;

  return Math.min(100, Math.round((progress / target) * 100));
};

const SkeletonChallenge = () => (
  <div className="rounded-2xl border border-slate-200 p-3 space-y-2 animate-pulse">
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 space-y-1">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        <div className="h-3 bg-slate-100 rounded w-full"></div>
      </div>

      <div className="h-6 bg-slate-200 rounded w-16"></div>
    </div>

    <div className="h-1.5 bg-slate-100 rounded-full"></div>

    <div className="h-3 bg-slate-100 rounded w-1/2"></div>
  </div>
);

const formatRemaining = (endsAt?: string | null) => {
  if (!endsAt) return '';

  const diff = new Date(endsAt).getTime() - Date.now();

  if (diff <= 0) return 'Ended';

  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);

  if (days > 0) return `${days}d ${hours}h`;

  if (hours > 0) return `${hours}h ${mins}m`;

  return `${mins}m`;
};

/**
 * Module-level cache so data survives component unmounts (route/nav changes)
 * key: gameId -> challenges[]
 */
// let challengeCacheStore: Record<number, UserChallengeProgressDto[]> = {};

export const GamesContent = () => {
  const [selected, setSelected] = useState<GameInfo | null>(null);

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>('daily');

  const [gameChallenges, setGameChallenges] = useState<
    UserChallengeProgressDto[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);
  const lastEvent = useSelector((state: RootState) => state.game.lastEvent);

  /**
   * LOAD CHALLENGES
   */

  useEffect(() => {
    if (!selected) {
      setGameChallenges([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadChallenges = async () => {
      setIsLoading(true);

      try {
        const challenges = await getGameChallenges(selected.id);

        if (!isMounted) return;

        setGameChallenges(challenges);
      } catch (error) {
        if (!isMounted) return;

        console.error(error);
        setGameChallenges([]);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadChallenges();

    return () => {
      isMounted = false;
    };
  }, [selected]);

  useEffect(() => {
    if (!lastEvent) return;
    if (!selected) return;
    if (lastEvent.gameId !== selected.id) return;

    setGameChallenges((current) => {
      let changed = false;

      const updated = current.map((challenge) => {
        /**
         * Skip already completed challenges
         */
        if (challenge.completed) return challenge;

        let shouldIncrement = false;

        /**
         * KILL
         */
        if (challenge.eventType === 'KILL' && lastEvent.eventType === 'KILL') {
          shouldIncrement = true;
        }

        /**
         * HEADSHOT KILL
         */
        if (
          challenge.eventType === 'HEADSHOT' &&
          lastEvent.eventType === 'KILL' &&
          lastEvent.metadata?.headshot
        ) {
          shouldIncrement = true;
        }

        if (!shouldIncrement) return challenge;

        changed = true;

        const nextProgress = (challenge.progress ?? 0) + 1;
        const isCompleted = nextProgress >= challenge.targetValue;

        return {
          ...challenge,
          progress: nextProgress,
          completed: isCompleted,
        };
      });

      /**
       * Nothing changed → avoid rerender
       */
      if (!changed) return current;

      return updated;
    });
  }, [lastEvent, selected]);

  useEffect(() => {
    console.log('Registering progress listener');

    const listener = (message: any) => {
      const { id, content } = message;

      if (id !== 'progress_update') return;

      console.log('GAME CONTENT RECEIVED:', content);

      const updates = content?.updates ?? [];

      console.log('PROGRESS UPDATES:', updates);

      setGameChallenges((current) =>
        current.map((challenge) => {
          const update = updates.find(
            (u: any) => u.challengeId === challenge.challengeId,
          );

          if (!update) return challenge;

          return {
            ...challenge,
            progress: update.progress,
            targetValue: update.targetValue,
            completed: update.completed,
            claimed: update.claimed,
          };
        }),
      );
    };

    overwolf.windows.onMessageReceived.addListener(listener);

    return () => {
      overwolf.windows.onMessageReceived.removeListener(listener);
    };
  }, []);
  // Using module-level `challengeCacheStore`; no auto-sync effect needed here.

  /**
   * FILTERS
   */

  const dailyChallenges = useMemo(
    () => gameChallenges.filter((item) => item?.challengeType === 'DAILY'),
    [gameChallenges],
  );

  const weeklyChallenges = useMemo(
    () => gameChallenges.filter((item) => item?.challengeType === 'WEEKLY'),
    [gameChallenges],
  );

  const getSectionRemaining = (challenges: UserChallengeProgressDto[]) => {
    if (!challenges.length) return null;

    const endsAt = challenges[0]?.endsAt;

    return formatRemaining(endsAt);
  };

  /**
   * GRID ROW LOGIC
   */
  const selectedIndex = GAMES.findIndex((game) => game.id === selected?.id);

  const expandedRow =
    selectedIndex >= 0 ? Math.floor(selectedIndex / ITEMS_PER_ROW) : -1;

  return (
    <div className="space-y-8">
      <section
        className="rounded-3xl p-6"
        style={{
          background: '#151824',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        }}
      >
        {/* HEADER */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-white">All Games</h3>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GAMES.map((game, index) => {
            const isActive = selected?.id === game.id;

            const logoSrc = game.logo ?? `/images/games/logo/${game.slug}.png`;

            const hasImage = Boolean(game.image);

            const currentRow = Math.floor(index / ITEMS_PER_ROW);

            const isLastItemInRow =
              index === GAMES.length - 1 ||
              Math.floor((index + 1) / ITEMS_PER_ROW) !== currentRow;

            const shouldRenderExpanded =
              expandedRow === currentRow && isLastItemInRow;

            return (
              <div key={game.id} className="contents">
                {/* GAME CARD */}
                <div
                  onClick={() => setSelected(isActive ? null : game)}
                  className={`
                  relative overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer
                  h-[180px] bg-[#1b2030]
                  ${
                    isActive
                      ? 'border-green-400 shadow-[0_0_0_1px_rgba(74,222,128,0.7)]'
                      : 'border-slate-700 hover:border-green-400'
                  }
                `}
                >
                  {hasImage && (
                    <>
                      <div
                        className="absolute inset-0 scale-110"
                        style={{
                          backgroundImage: `url(${game.image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          filter: 'blur(3px)',
                        }}
                      />

                      <div className="absolute inset-0 bg-black/60" />
                    </>
                  )}

                  {/* CONTENT */}
                  <div className="relative flex h-full flex-col justify-between p-5">
                    <div className="flex justify-center">
                      <img
                        src={logoSrc}
                        alt={game.title}
                        className="h-24 w-24 object-contain"
                      />
                    </div>

                    <div className="flex justify-center">
                      {/* <div className="rounded-full border border-white/10 bg-white/10 px-5 py-2 backdrop-blur-xl">
                        <h4 className="text-lg font-semibold text-white">
                          {game.title}
                        </h4>
                      </div> */}
                      <div className="max-w-[180px] rounded-full border border-white/10 bg-white/10 px-5 py-2 backdrop-blur-xl">
                        <h4 className="overflow-hidden text-ellipsis whitespace-nowrap text-center text-lg font-semibold text-white">
                          {game.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EXPANDED PANEL */}
                {shouldRenderExpanded && selected && (
                  <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                    <div
                      className="rounded-3xl border p-5"
                      style={{
                        background: '#151824',
                        borderColor: '#2a3145',
                      }}
                    >
                      {/* PANEL HEADER */}
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                            Challenges
                          </p>

                          <h4 className="mt-2 text-2xl font-bold text-white">
                            {selected.title}
                          </h4>
                        </div>

                        <button
                          onClick={() => setSelected(null)}
                          className="rounded-xl border border-slate-700 bg-[#1b2030] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#23293d]"
                        >
                          Close
                        </button>
                      </div>

                      {/* LOADING */}
                      {isLoading ? (
                        <div className="space-y-3">
                          <div className="rounded-2xl border border-slate-700 p-3 space-y-2 animate-pulse">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 space-y-1">
                                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-800 rounded w-full"></div>
                              </div>
                              <div className="h-6 bg-slate-700 rounded w-16"></div>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full"></div>
                            <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                          </div>

                          <div className="rounded-2xl border border-slate-700 p-3 space-y-2 animate-pulse">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 space-y-1">
                                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                                <div className="h-3 bg-slate-800 rounded w-full"></div>
                              </div>
                              <div className="h-6 bg-slate-700 rounded w-16"></div>
                            </div>
                            <div className="h-1.5 bg-slate-800 rounded-full"></div>
                            <div className="h-3 bg-slate-800 rounded w-1/2"></div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          {/* TABS */}
                          <div className="mb-6 flex items-center gap-3 border-b border-slate-700 pb-3">
                            <button
                              onClick={() => setActiveTab('daily')}
                              className={`
                              rounded-xl px-4 py-2 text-sm font-semibold transition-all
                              ${
                                activeTab === 'daily'
                                  ? 'bg-green-500 text-black shadow-sm'
                                  : 'bg-[#1b2030] text-slate-300 hover:bg-[#23293d]'
                              }
                            `}
                            >
                              Daily Challenges ({dailyChallenges.length})
                            </button>

                            <button
                              onClick={() => setActiveTab('weekly')}
                              className={`
                              rounded-xl px-4 py-2 text-sm font-semibold transition-all
                              ${
                                activeTab === 'weekly'
                                  ? 'bg-purple-500 text-white shadow-sm'
                                  : 'bg-[#1b2030] text-slate-300 hover:bg-[#23293d]'
                              }
                            `}
                            >
                              Weekly Challenges ({weeklyChallenges.length})
                            </button>
                          </div>

                          {/* HEADER */}
                          <div className="mb-5 flex items-center justify-between">
                            <div>
                              <h5 className="text-xl font-bold text-white">
                                {activeTab === 'daily'
                                  ? 'Daily Challenges'
                                  : 'Weekly Challenges'}
                              </h5>

                              <p className="mt-1 text-sm text-slate-400">
                                Resets in{' '}
                                {activeTab === 'daily'
                                  ? getSectionRemaining(dailyChallenges)
                                  : getSectionRemaining(weeklyChallenges)}
                              </p>
                            </div>
                          </div>

                          {/* CHALLENGES */}
                          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {(activeTab === 'daily'
                              ? dailyChallenges
                              : weeklyChallenges
                            ).map((item) => (
                              <div
                                key={item.id}
                                className="rounded-2xl border border-slate-700 bg-[#1b2030] p-4 transition-all hover:border-green-400"
                              >
                                <div className="mb-3 flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-white">
                                      {item.title}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                      {item.description}
                                    </p>
                                  </div>

                                  <span
                                    className={`
                                    rounded-full px-2 py-1 text-xs font-semibold
                                    ${
                                      activeTab === 'daily'
                                        ? 'bg-green-500/15 text-green-400'
                                        : 'bg-purple-500/15 text-purple-400'
                                    }
                                  `}
                                  >
                                    +{item.rewardValue}
                                  </span>
                                </div>

                                {/* PROGRESS */}
                                <div className="h-2 overflow-hidden rounded-full bg-[#0f1320]">
                                  <div
                                    className={`
                                    h-full rounded-full transition-all
                                    ${
                                      activeTab === 'daily'
                                        ? 'bg-green-400'
                                        : 'bg-purple-500'
                                    }
                                  `}
                                    style={{
                                      width: `${challengePoints(item)}%`,
                                    }}
                                  />
                                </div>

                                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                                  <span>
                                    {item.progress ?? 0}/{item.targetValue}
                                  </span>

                                  <span>{item.eventType}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* EMPTY STATE */}
                          {(activeTab === 'daily'
                            ? dailyChallenges.length === 0
                            : weeklyChallenges.length === 0) && (
                            <div className="rounded-2xl border border-dashed border-slate-700 bg-[#1b2030] py-10 text-center">
                              <p className="text-sm text-slate-400">
                                No {activeTab === 'daily' ? 'daily' : 'weekly'}{' '}
                                challenges available.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      <div className="text-center py-4">
        <p className="text-3xl font-bold text-white tracking-wide">
          More Games Coming Soon
        </p>
      </div>
    </div>
  );
};

/**
 * Module-level cache so data survives component unmounts (route/nav changes)
 * key: gameId -> challenges[]
 */
