export const ProfileContent = () => (
  <div className="space-y-8">
    <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Profile</p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">Your player profile</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Username</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">QuestHero92</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Membership</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">Free tier</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Email</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">player@example.com</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Achievements</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">18 unlocked</p>
        </div>
      </div>
    </section>

    <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
      <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Settings</p>
      <div className="mt-5 grid gap-4">
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Language</p>
          <p className="mt-2 text-base font-semibold text-slate-900">English</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm text-slate-500">Notifications</p>
          <p className="mt-2 text-base font-semibold text-slate-900">Enabled</p>
        </div>
      </div>
    </section>
  </div>
);
