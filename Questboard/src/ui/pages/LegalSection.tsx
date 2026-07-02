// LegalSection.tsx

import { ReactNode } from 'react';

type Props = {
  number: number;
  title: string;
  children: ReactNode;
};

export const LegalSection = ({ number, title, children }: Props) => {
  return (
    <section className="mb-8 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-sky-500/30">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500 text-lg font-bold text-white">
          {number}
        </div>

        <h2 className="text-2xl font-semibold text-white">
          {title}
        </h2>
      </div>

      <div className="space-y-4 text-[15px] leading-7 text-slate-300">
        {children}
      </div>
    </section>
  );
};