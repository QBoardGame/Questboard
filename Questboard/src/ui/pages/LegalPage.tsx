import { ReactNode } from 'react';

type LegalPageProps = {
  title: string;
  children: ReactNode;
  onBack: () => void;
};

export const LegalPage = ({
  title,
  children,
  onBack,
}: LegalPageProps) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex h-screen max-w-5xl flex-col px-6 py-8">

        <button
          onClick={onBack}
          className="mb-6 flex w-fit items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 transition hover:border-slate-600 hover:bg-slate-800"
        >
          ← Back
        </button>

        <div className="flex-1 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">

          <div className="border-b border-slate-800 px-10 py-8">
            <h1 className="text-4xl font-bold text-white">
              {title}
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Last Updated: June 28, 2026
            </p>
          </div>

          <div className="h-[calc(100%-120px)] overflow-y-auto px-10 py-8">
            <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-slate-300 prose-li:text-slate-300 prose-strong:text-white">
              {children}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};