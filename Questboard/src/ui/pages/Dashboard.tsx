import { GamesContent } from './GamesContent';

interface DashboardProps {
  onNavigate: (route: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = () => {
  return (
    <div className="space-y-8">
      <section
        className="rounded-3xl p-6"
        style={{
          background: '#151824',
          boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
        }}
      >
        <h2 className="text-3xl font-bold text-white">Welcome to RuneRush</h2>

        <p className="mt-3 max-w-2xl text-slate-400">
          Complete in-game challenges, earn Rune, and unlock rewards while
          playing your favorite games.
        </p>

        <div className="mt-8">
          <h3 className="mb-4 text-xl font-semibold text-white">
            How It Works
          </h3>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-700 bg-[#1b2030] p-5">
              <div className="mb-3 text-3xl">🎮</div>
              <h4 className="font-semibold text-white">1. Choose a Game</h4>
              <p className="mt-2 text-sm text-slate-400">
                Select one of the supported games below.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-[#1b2030] p-5">
              <div className="mb-3 text-3xl">🎯</div>
              <h4 className="font-semibold text-white">
                2. Complete Challenges
              </h4>
              <p className="mt-2 text-sm text-slate-400">
                Finish daily and weekly objectives while playing.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-700 bg-[#1b2030] p-5">
              <div className="mb-3 text-3xl">💰</div>
              <h4 className="font-semibold text-white">3. Earn Rewards</h4>
              <p className="mt-2 text-sm text-slate-400">
                Collect coins and redeem them for rewards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <GamesContent />
    </div>
  );
};
