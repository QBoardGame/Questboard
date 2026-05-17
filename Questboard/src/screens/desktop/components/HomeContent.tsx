import { Overview } from "features/overview";

export const HomeContent = () => (
  <div className="space-y-8">
    <section className="grid gap-5 lg:grid-cols-3">
      <div className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">    
        <h2 className="mt-4 text-2xl font-semibold text-slate-900">Questboard dashboard</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Monitor your sessions, check progress, and jump into the games that matter most.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-950/95 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <p className="text-sm uppercase tracking-[0.3em] text-slate-300">Current streak</p>
        <p className="mt-4 text-3xl font-semibold">4 days</p>
        <p className="mt-2 text-sm text-slate-300">
          Keep the momentum going by launching your next session from the games panel.
        </p>
      </div>

      <div className="rounded-3xl bg-sky-600/95 p-6 text-white shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <p className="text-sm uppercase tracking-[0.3em] text-sky-100">Top objective</p>
        <p className="mt-4 text-3xl font-semibold">Complete 3 quests</p>
        <p className="mt-2 text-sm text-sky-100">
          Your dashboard will surface quest suggestions and game insights here.
        </p>
      </div>
    </section>

    <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Live overview</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-900">Recent activity & game insights</h3>
        </div>
      </div>
      <Overview />
    </section>
  </div>
);
