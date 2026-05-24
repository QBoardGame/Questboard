export const CreatorDashboard = () => (
  <div className="space-y-8">
    <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Creator Dashboard</p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">Creator tools and insights</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Creator overview</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">Manage your campaigns, streams, and brand collaborations.</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Analytics</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">View your reach, performance, and conversion metrics.</p>
        </div>
      </div>
    </section>
  </div>
);
