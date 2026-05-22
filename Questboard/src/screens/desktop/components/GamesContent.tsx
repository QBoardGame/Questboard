import { useState } from "react";
import { GAMES, GameInfo } from "data/games";

export const GamesContent = () => {
  const [selected, setSelected] = useState<GameInfo | null>(null);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Your games</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">Recent play sessions</h3>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {GAMES.map((game) => (
            <div key={game.id} className={`rounded-3xl border p-5 transition hover:border-sky-400 hover:shadow-md ${selected?.id === game.id ? 'border-sky-400 shadow-md' : 'border-slate-200'}`} onClick={() => setSelected(game)}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{game.title}</p>
                  <p className="text-sm text-slate-500">{game.platform}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                  View
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span>{game.tasks.daily.length} daily tasks</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span>{game.tasks.weekly.length} weekly tasks</span>
              </div>
            </div>
          ))}
        </div>

        {selected && (
          <div className="mt-6 rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold">{selected.title} — Tasks</h4>
                <p className="text-sm text-slate-500">Tracking is automatic when Overwolf detects the game.</p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <h5 className="text-sm font-semibold">Daily</h5>
                <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
                  {selected.tasks.daily.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-semibold">Weekly</h5>
                <ul className="mt-2 list-inside list-disc text-sm text-slate-600">
                  {selected.tasks.weekly.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        )}
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl bg-slate-950/95 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Performance</p>
          <p className="mt-4 text-3xl font-semibold">Ranked top 12%</p>
          <p className="mt-2 text-sm text-slate-300">Keep pushing to stay in the top percentile across your favorite titles.</p>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Session cadence</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">3 sessions this week</p>
          <p className="mt-2 text-sm text-slate-600">Scheduled reminders help you stay on track and hit your goals.</p>
        </div>
      </section>
    </div>
  );
};
