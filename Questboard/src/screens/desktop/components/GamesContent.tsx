import { useEffect, useMemo, useState } from "react";
import { GAMES, GameInfo } from "data/games";
import { ChallengeWithProgressDto, getGameChallenges } from "lib/challenges";

const ITEMS_PER_ROW = 4;

const challengePoints = (challenge: ChallengeWithProgressDto) => {
  const progress = challenge.progress?.progress ?? 0;
  const target = challenge.challenge.targetValue || 1;

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
  if (!endsAt) return "";

  const diff = new Date(endsAt).getTime() - Date.now();

  if (diff <= 0) return "Ended";

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
let challengeCacheStore: Record<number, ChallengeWithProgressDto[]> = {};

export const GamesContent = () => {
  const [selected, setSelected] = useState<GameInfo | null>(null);

  const [activeTab, setActiveTab] = useState<"daily" | "weekly">(
    "daily"
  );

  const [gameChallenges, setGameChallenges] = useState<
    ChallengeWithProgressDto[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  /**
   * LOAD CHALLENGES
   */
  useEffect(() => {
    if (!selected) {
      setGameChallenges([]);
      return;
    }

    const gameId = selected.id;

    /**
     * USE MODULE-LEVEL CACHE FIRST
     */
    if (challengeCacheStore[gameId]) {
      setGameChallenges(challengeCacheStore[gameId]);
      return;
    }

    let isMounted = true;

    const loadChallenges = async () => {
      setIsLoading(true);

      try {
        const challenges = await getGameChallenges(gameId);

        if (!isMounted) return;

        /**
         * UPDATE CURRENT UI
         */
        setGameChallenges(challenges);

        /**
         * SAVE IN MODULE CACHE
         */
        challengeCacheStore[gameId] = challenges;
      } catch {
        if (!isMounted) return;

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

  // Using module-level `challengeCacheStore`; no auto-sync effect needed here.

  /**
   * FILTERS
   */
  const dailyChallenges = useMemo(
    () =>
      gameChallenges.filter(
        (item) =>
          (item.challenge.challengeType || "").toLowerCase() ===
          "daily"
      ),
    [gameChallenges]
  );

  const weeklyChallenges = useMemo(
    () =>
      gameChallenges.filter(
        (item) =>
          (item.challenge.challengeType || "").toLowerCase() ===
          "weekly"
      ),
    [gameChallenges]
  );

  const getSectionRemaining = (
    challenges: ChallengeWithProgressDto[]
  ) => {
    if (!challenges.length) return null;

    const endsAt = challenges[0]?.challenge?.endsAt;

    return formatRemaining(endsAt);
  };

  /**
   * GRID ROW LOGIC
   */
  const selectedIndex = GAMES.findIndex(
    (game) => game.id === selected?.id
  );

  const expandedRow =
    selectedIndex >= 0
      ? Math.floor(selectedIndex / ITEMS_PER_ROW)
      : -1;

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        {/* HEADER */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-slate-900">
            All Games
          </h3>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GAMES.map((game, index) => {
            const isActive = selected?.id === game.id;

            const logoSrc =
              game.logo ??
              `/images/games/logo/${game.slug}.png`;

            const hasImage = Boolean(game.image);

            const currentRow = Math.floor(
              index / ITEMS_PER_ROW
            );

            const isLastItemInRow =
              index === GAMES.length - 1 ||
              Math.floor((index + 1) / ITEMS_PER_ROW) !==
                currentRow;

            const shouldRenderExpanded =
              expandedRow === currentRow &&
              isLastItemInRow;

            return (
              <div key={game.id} className="contents">
                {/* GAME CARD */}
                <div
                  onClick={() =>
                    setSelected(isActive ? null : game)
                  }
                  className={`
                    relative overflow-hidden rounded-3xl border transition-all duration-300 cursor-pointer
                    h-[180px]
                    ${
                      isActive
                        ? "border-lime-400 shadow-[0_0_0_1px_rgba(163,230,53,0.7)]"
                        : "border-slate-200 hover:border-sky-400"
                    }
                  `}
                >
                  {/* BACKGROUND */}
                  {hasImage && (
                    <>
                      <div
                        className="absolute inset-0 scale-110"
                        style={{
                          backgroundImage: `url(${game.image})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          filter: "blur(5px)",
                        }}
                      />

                      <div className="absolute inset-0 bg-black/50" />
                    </>
                  )}

                  {/* CONTENT */}
                  <div className="relative flex h-full flex-col justify-between p-5">
                    <div className="flex justify-center">
                      <img
                        src={logoSrc}
                        alt={game.title}
                        className="h-12 w-12 object-contain"
                      />
                    </div>

                    <div className="flex justify-center">
                      <div className="rounded-full border border-white/10 bg-white/10 px-5 py-2 backdrop-blur-xl">
                        <h4 className="text-lg font-semibold text-white">
                          {game.title}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>

                {/* EXPANDED PANEL */}
                {shouldRenderExpanded && selected && (
                  <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                      {/* PANEL HEADER */}
                      <div className="mb-6 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                            Challenges
                          </p>

                          <h4 className="mt-2 text-2xl font-bold text-slate-900">
                            {selected.title}
                          </h4>
                        </div>

                        <button
                          onClick={() => setSelected(null)}
                          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium"
                        >
                          Close
                        </button>
                      </div>

                      {/* LOADING */}
                      {isLoading ? (
                        <div className="space-y-3">
                          <SkeletonChallenge />
                          <SkeletonChallenge />
                          <SkeletonChallenge />
                        </div>
                      ) : (
                        <div>
                          {/* TABS */}
                          <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-3">
                            <button
                              onClick={() =>
                                setActiveTab("daily")
                              }
                              className={`
                                rounded-xl px-4 py-2 text-sm font-semibold transition-all
                                ${
                                  activeTab === "daily"
                                    ? "bg-sky-600 text-white shadow-sm"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }
                              `}
                            >
                              Daily Challenges (
                              {dailyChallenges.length})
                            </button>

                            <button
                              onClick={() =>
                                setActiveTab("weekly")
                              }
                              className={`
                                rounded-xl px-4 py-2 text-sm font-semibold transition-all
                                ${
                                  activeTab === "weekly"
                                    ? "bg-purple-600 text-white shadow-sm"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }
                              `}
                            >
                              Weekly Challenges (
                              {weeklyChallenges.length})
                            </button>
                          </div>

                          {/* HEADER */}
                          <div className="mb-5 flex items-center justify-between">
                            <div>
                              <h5 className="text-xl font-bold text-slate-900">
                                {activeTab === "daily"
                                  ? "Daily Challenges"
                                  : "Weekly Challenges"}
                              </h5>

                              <p className="mt-1 text-sm text-slate-500">
                                Resets in{" "}
                                {activeTab === "daily"
                                  ? getSectionRemaining(
                                      dailyChallenges
                                    )
                                  : getSectionRemaining(
                                      weeklyChallenges
                                    )}
                              </p>
                            </div>
                          </div>

                          {/* CHALLENGES */}
                          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {(activeTab === "daily"
                              ? dailyChallenges
                              : weeklyChallenges
                            ).map((item) => (
                              <div
                                key={item.challenge.id}
                                className="rounded-2xl border border-slate-200 bg-white p-4 transition-all hover:shadow-md"
                              >
                                <div className="mb-3 flex items-start justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                      {item.challenge.title}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                      {
                                        item.challenge
                                          .description
                                      }
                                    </p>
                                  </div>

                                  <span
                                    className={`
                                      rounded-full px-2 py-1 text-xs font-semibold
                                      ${
                                        activeTab ===
                                        "daily"
                                          ? "bg-sky-50 text-sky-700"
                                          : "bg-purple-50 text-purple-700"
                                      }
                                    `}
                                  >
                                    +
                                    {
                                      item.challenge
                                        .rewardValue
                                    }
                                  </span>
                                </div>

                                {/* PROGRESS */}
                                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                  <div
                                    className={`
                                      h-full rounded-full transition-all
                                      ${
                                        activeTab ===
                                        "daily"
                                          ? "bg-sky-600"
                                          : "bg-purple-600"
                                      }
                                    `}
                                    style={{
                                      width: `${challengePoints(
                                        item
                                      )}%`,
                                    }}
                                  />
                                </div>

                                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                                  <span>
                                    {item.progress
                                      ?.progress ?? 0}
                                    /
                                    {
                                      item.challenge
                                        .targetValue
                                    }
                                  </span>

                                  <span>
                                    {
                                      item.challenge
                                        .eventType
                                    }
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* EMPTY STATE */}
                          {(activeTab === "daily"
                            ? dailyChallenges.length === 0
                            : weeklyChallenges.length ===
                              0) && (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-10 text-center">
                              <p className="text-sm text-slate-500">
                                No{" "}
                                {activeTab === "daily"
                                  ? "daily"
                                  : "weekly"}{" "}
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
    </div>
  );
};

/**
 * Module-level cache so data survives component unmounts (route/nav changes)
 * key: gameId -> challenges[]
 */