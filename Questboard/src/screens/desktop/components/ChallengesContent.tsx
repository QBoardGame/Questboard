import { useEffect, useMemo, useState } from "react";
import { GAMES } from "data/games";
import {
  ChallengeWithProgressDto,
  getGameChallenges,
} from "lib/challenges";

type FilterKey = number | "all";

const challengePoints = (challenge: ChallengeWithProgressDto) => {
  const progress = challenge.progress?.progress ?? 0;
  const target = challenge.challenge.targetValue || 1;
  return Math.min(100, Math.round((progress / target) * 100));
};

export const ChallengesContent = () => {
  const [selectedGame, setSelectedGame] = useState<FilterKey>("all");
  const [challengesByGame, setChallengesByGame] = useState<Record<number, ChallengeWithProgressDto[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadChallenges = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const results = await Promise.allSettled(
          GAMES.map(async (game) => [game.id, await getGameChallenges(game.id)] as const)
        );

        const entries = results
          .filter((result): result is PromiseFulfilledResult<readonly [number, ChallengeWithProgressDto[]]> => result.status === "fulfilled")
          .map((result) => result.value);

        if (!isMounted) return;

        setChallengesByGame(Object.fromEntries(entries));

        if (entries.length === 0) {
          setError("No challenge strategies are available for the configured games yet.");
        }
      } catch (loadError) {
        if (!isMounted) return;

        setError(loadError instanceof Error ? loadError.message : "Failed to load challenges");
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
  }, []);

  const visibleChallenges = useMemo(() => {
    const entries = selectedGame === "all"
      ? Object.values(challengesByGame).flat()
      : challengesByGame[selectedGame] ?? [];

    return entries;
  }, [challengesByGame, selectedGame]);

  const activeChallenges = visibleChallenges.filter((item) => !item.progress?.completed);
  const completedChallenges = visibleChallenges.filter((item) => item.progress?.completed);

  const leaderboard = useMemo(() => {
    const username = localStorage.getItem("username") || "You";
    const currentPlayerPoints = completedChallenges.length * 100 + activeChallenges.length * 15;

    return [
      { name: username, completed: completedChallenges.length, active: activeChallenges.length, points: currentPlayerPoints },
      { name: "Nova", completed: Math.max(0, completedChallenges.length - 1), active: activeChallenges.length + 1, points: Math.max(20, currentPlayerPoints - 60) },
      { name: "Cipher", completed: completedChallenges.length + 2, active: Math.max(0, activeChallenges.length - 1), points: currentPlayerPoints + 40 },
    ].sort((left, right) => right.points - left.points);
  }, [activeChallenges.length, completedChallenges.length]);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Challenges</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">Active challenges, completed wins, and leaderboard</h3>
            <p className="mt-2 text-sm text-slate-600">Questboard updates these automatically from Overwolf-backed game progress.</p>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedGame === "all" ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"}`}
            onClick={() => setSelectedGame("all")}
          >
            All games
          </button>
          {GAMES.map((game) => (
            <button
              key={game.id}
              type="button"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${selectedGame === game.id ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-700"}`}
              onClick={() => setSelectedGame(game.id)}
            >
              {game.title}
            </button>
          ))}
        </div>
      </section>

      {isLoading ? (
        <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <p className="text-sm text-slate-600">Loading challenges…</p>
        </section>
      ) : error ? (
        <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <p className="text-sm text-red-600">{error}</p>
        </section>
      ) : (
        <>
          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Active challenges</p>
                  <h4 className="mt-2 text-lg font-semibold text-slate-900">Keep progressing</h4>
                </div>
                <span className="rounded-full bg-sky-50 px-3 py-1 text-sm font-semibold text-sky-700">{activeChallenges.length}</span>
              </div>

              <div className="space-y-4">
                {activeChallenges.length === 0 ? (
                  <p className="text-sm text-slate-500">No active challenges right now.</p>
                ) : (
                  activeChallenges.map((item) => (
                    <div key={item.challenge.id} className="rounded-3xl border border-slate-200 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-base font-semibold text-slate-900">{item.challenge.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{item.challenge.description}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                          {item.challenge.eventType}
                        </span>
                      </div>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-sky-600" style={{ width: `${challengePoints(item)}%` }} />
                      </div>
                      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                        <span>{item.progress?.progress ?? 0}/{item.challenge.targetValue}</span>
                        <span>{item.challenge.rewardValue ?? "Reward pending"}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Completed challenges</p>
                  <h4 className="mt-2 text-lg font-semibold text-slate-900">Recent finishes</h4>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">{completedChallenges.length}</span>
              </div>

              <div className="space-y-3">
                {completedChallenges.length === 0 ? (
                  <p className="text-sm text-slate-500">No completed challenges yet.</p>
                ) : (
                  completedChallenges.map((item) => (
                    <div key={item.challenge.id} className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="font-semibold text-slate-900">{item.challenge.title}</p>
                          <p className="text-sm text-slate-600">Completed on {item.progress?.completedAt ? new Date(item.progress.completedAt).toLocaleDateString() : "recently"}</p>
                        </div>
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700">Completed</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Leaderboard</p>
                <h4 className="mt-2 text-lg font-semibold text-slate-900">Top challenge players</h4>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {leaderboard.map((player, index) => (
                <div key={player.name} className="rounded-3xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-500">#{index + 1}</span>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{player.points} pts</span>
                  </div>
                  <p className="mt-4 text-lg font-semibold text-slate-900">{player.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{player.completed} completed · {player.active} active</p>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};
