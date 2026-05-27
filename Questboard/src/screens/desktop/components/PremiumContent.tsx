const pricingPlans = [
  {
    name: "Starter",
    price: "$4.99",
    description: "For casual players who want a smarter edge.",
    items: [
      "Ad-free game tracking",
      "Basic progress insights",
      "Daily challenge suggestions",
    ],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$12.99",
    description: "Most popular for competitive players and streamers.",
    items: [
      "Everything in Starter",
      "Advanced performance analytics",
      "Priority rewards and bonuses",
      "Custom challenge recommendations",
    ],
    highlight: true,
  },
  {
    name: "Elite",
    price: "$24.99",
    description: "For teams and power users who want full control.",
    items: [
      "Everything in Pro",
      "Team insights and leaderboard coaching",
      "Exclusive in-app offers",
      "Early access to new features",
    ],
    highlight: false,
  },
];

export const PremiumContent = () => (
  <div className="space-y-8">

    <section className="rounded-3xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
      <div className="mb-8 text-center">
        <h4 className="mt-2 text-2xl font-semibold text-slate-900">Plans</h4>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-3xl border p-6 transition ${plan.highlight ? "border-sky-500 bg-sky-50 shadow-lg" : "border-slate-200 bg-white hover:shadow-md"}`}
          >
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">{plan.name}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{plan.price}</p>
              </div>
              {plan.highlight && (
                <span className="rounded-full bg-sky-600 px-3 py-1 text-xs font-semibold uppercase text-white">Popular</span>
              )}
            </div>

            <p className="text-sm leading-6 text-slate-600">{plan.description}</p>

            <ul className="mt-8 space-y-4 text-sm text-slate-600">
              {plan.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-600 text-xs font-semibold">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8">
              <button
                type="button"
                className={`w-full rounded-3xl px-4 py-3 text-sm font-semibold transition ${plan.highlight ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-slate-100 text-slate-900 hover:bg-slate-200"}`}
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
