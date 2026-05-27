import { useEffect, useState } from "react";
import { ChallengeWithProgressDto, getStreamerChallenges } from "lib/challenges";

const challengePoints = (challenge: ChallengeWithProgressDto) => {
  const progress = challenge.progress?.progress ?? 0;
  const target = challenge.challenge.targetValue || 1;
  return Math.min(100, Math.round((progress / target) * 100));
};

export const ChallengesContent = () => {
  const [challenges, setChallenges] = useState<ChallengeWithProgressDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setIsLoading(true);

      try {
        const data = await getStreamerChallenges();

        if (!isMounted) return;

        setChallenges(data);
      } catch {
        if (!isMounted) return;
        // On any error, show empty list (no challenges found)
        setChallenges([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Challenges</p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">Available challenges</h3>
        <p className="mt-2 text-sm text-slate-600">Showing STREAMERS challenges across supported games.</p>
      </section>

      {isLoading ? (
        <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <p className="text-sm text-slate-600">Loading challenges…</p>
        </section>
      ) : challenges.length === 0 ? (
        <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <p className="text-sm text-slate-500">No challenges found.</p>
        </section>
      ) : (
        <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <div className="space-y-4">
            {challenges.map((item) => (
              <div key={item.challenge.id} className="rounded-3xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-slate-900">{item.challenge.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.challenge.description}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{item.challenge.eventType}</span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-sky-600" style={{ width: `${challengePoints(item)}%` }} />
                </div>

                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>{item.progress?.progress ?? 0}/{item.challenge.targetValue}</span>
                  <span>{item.challenge.rewardValue ?? "Reward pending"}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
