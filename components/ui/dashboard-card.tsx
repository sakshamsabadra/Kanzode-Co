import { ReactNode } from "react";
import Link from "next/link";

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  trend: string;
  icon: ReactNode;
  href?: string;
}

export function DashboardCard({
  title,
  value,
  description,
  trend,
  icon,
  href
}: DashboardCardProps) {
  const content = (
    <div className={`rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.05)] ${href ? "transition-transform hover:scale-[1.02] hover:shadow-[0_24px_80px_rgba(15,23,42,0.1)] cursor-pointer" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-semibold text-slate-950">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
          {icon}
        </div>
      </div>
      <p className="mt-4 text-sm leading-6 text-slate-600">{description}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.22em] text-brand-500">
        {trend}
      </p>
    </div>
  );

  return href ? <Link href={href} className="block">{content}</Link> : content;
}
