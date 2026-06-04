import React from 'react';

type ComingSoonPageProps = {
  pageName: string;
  description?: string;
};

const ComingSoonPage = ({
  pageName,
  description,
}: ComingSoonPageProps) => {
  return (
    <div className="h-full flex items-center justify-center px-6 py-6">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-900/70 backdrop-blur-xl shadow-2xl max-w-2xl w-full">
        {/* Glow effects */}
        <div className="absolute -top-20 -left-20 h-48 w-48 rounded-full bg-sky-500/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative z-10 p-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sky-500/10 border border-sky-500/20">
            🚀
          </div>

          <span className="inline-flex items-center rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-1 text-xs font-medium uppercase tracking-wider text-sky-400">
            Coming Soon
          </span>

          <h1 className="mt-6 text-4xl font-bold text-white">
            {pageName}
          </h1>

          <p className="mt-4 text-slate-400 text-lg">
            {description ||
              `We're building something awesome for ${pageName}. Stay tuned for upcoming updates.`}
          </p>

          <div className="mt-8 flex justify-center">
            <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300">
              ✨ New features are on the way
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoonPage;