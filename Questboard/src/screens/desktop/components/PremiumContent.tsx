import { AdsSlot, GetPremium } from "features/monetization";

export const PremiumContent = () => (
  <div className="space-y-8">
    <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Premium</p>
        <h3 className="mt-2 text-xl font-semibold text-slate-900">Level up your Questboard experience</h3>
      </div>
      <p className="text-sm leading-6 text-slate-600">
        Upgrade to premium to remove ads, unlock advanced analytics, and get personalized game recommendations.
      </p>
      <div className="mt-6">
        <GetPremium />
      </div>
    </section>

    <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Benefits</p>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Ad-free experience</p>
          <p className="mt-2 text-sm text-slate-600">Enjoy a cleaner dashboard with no interruptions.</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Advanced analytics</p>
          <p className="mt-2 text-sm text-slate-600">Get deeper play insights and smarter session advice.</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Priority support</p>
          <p className="mt-2 text-sm text-slate-600">Receive faster help from Questboard when you need it.</p>
        </div>
        <div className="rounded-3xl bg-slate-50 p-5">
          <p className="text-sm font-semibold text-slate-900">Exclusive rewards</p>
          <p className="mt-2 text-sm text-slate-600">Unlock members-only bonuses for your favorite games.</p>
        </div>
      </div>
    </section>

    <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Featured free content</p>
      <div className="mt-5">
        <AdsSlot width={400} height={300} />
      </div>
    </section>
  </div>
);
