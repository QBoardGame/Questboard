const pricingPlans = [
  {
    name: 'Plus',
    price: '₹199/mo',
    description:
      'Perfect for active players who want faster progression and better rewards.',
    items: [
      '+25% points boost',
      'Extra daily challenge slot',
      'Early access to new challenges',
      'Priority reward redemption queue',
      'Exclusive profile badges',
      'Higher monthly redemption limit',
    ],
    highlight: true,
  },
  {
    name: 'Pro',
    price: '₹499/mo',
    description:
      'Built for power users and competitive gamers who want premium advantages.',
    items: [
      '+50% points boost',
      'Double streak protection',
      'Exclusive premium challenges',
      'Advanced statistics',
      'Higher marketplace discounts',
      'VIP giveaways',
      'Higher redemption limits',
      'Priority support',
    ],
    highlight: false,
  },
  {
    name: 'Creator',
    price: '₹999/mo',
    description: 'Designed for creators, streamers, and community leaders.',
    items: [
      'Create custom challenges',
      'Host tournaments',
      'Custom leaderboards',
      'Verified creator badge',
      'Challenge analytics',
      'Sponsor integrations',
      'Featured placement on homepage',
    ],
    highlight: false,
  },
];

export const PremiumContent = () => (
  <div className="space-y-8">
    <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
      <div className="mb-8 text-center">
        <h4 className="mt-2 text-2xl font-semibold text-slate-900">
          Premium Membership Plans
        </h4>
        <p className="mt-2 text-sm text-slate-500">
          Unlock more rewards, challenges, and exclusive perks.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-3">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl border p-6 transition ${
              plan.highlight
                ? 'border-sky-500 bg-sky-50 shadow-lg'
                : 'border-slate-200 bg-white hover:shadow-md'
            }`}
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                  {plan.name}
                </p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">
                  {plan.price}
                </p>
              </div>
              {plan.highlight && (
                <span className="rounded-full bg-sky-600 px-3 py-1 text-xs font-semibold uppercase text-white">
                  Popular
                </span>
              )}
            </div>

            <p className="text-sm leading-6 text-slate-600">
              {plan.description}
            </p>

            <ul className="mt-8 space-y-4 text-sm text-slate-600">
              {plan.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-600 text-xs font-semibold">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <button
                type="button"
                className={`w-full rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                  plan.highlight
                    ? 'bg-sky-600 text-white hover:bg-sky-700'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                Choose {plan.name}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  </div>
);

