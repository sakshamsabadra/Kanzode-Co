import { ReactNode } from "react";

interface PanelProps {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function Panel({ eyebrow, title, description, children }: PanelProps) {
  return (
    <section className="rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.05)] backdrop-blur">
      <p className="text-xs uppercase tracking-[0.32em] text-slate-400">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl text-slate-950">{title}</h2>
      {description ? (
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">{description}</p>
      ) : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}
