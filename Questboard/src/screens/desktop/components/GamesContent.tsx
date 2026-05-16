const games = [
  {
    title: "Hearthstone",
    platform: "Overwolf",
    hours: "76h",
    status: "Active",
  },
  {
    title: "Fortnite",
    platform: "PC",
    hours: "42h",
    status: "Favorited",
  },
  {
    title: "Apex Legends",
    platform: "PC",
    hours: "28h",
    status: "Recommended",
  },
];

export const GamesContent = () => (
  <div className="space-y-8">
    <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Your games</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Recent play sessions</h3>
        </div>
      </div>
      <div className="space-y-4">
        {games.map((game) => (
          <div key={game.title} className="rounded-3xl border border-slate-200 p-5 transition hover:border-sky-400 hover:shadow-md">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-slate-900">{game.title}</p>
                <p className="text-sm text-slate-500">{game.platform}</p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">
                {game.status}
              </span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span>{game.hours} played</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>Next recommended session: today</span>
            </div>
          </div>
        ))}
      </div>
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
