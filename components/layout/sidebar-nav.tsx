import Link from "next/link";
import { Building2, LayoutDashboard, FileText, ReceiptText, Users2, Wrench, CheckSquare } from "lucide-react";
import { navigationItems } from "@/lib/navigation";

const iconMap: Record<string, any> = {
  dashboard: LayoutDashboard,
  clients: Users2,
  services: Wrench,
  quotations: FileText,
  invoices: ReceiptText,
  tasks: CheckSquare
};

export function SidebarNav() {
  return (
    <aside className="hidden w-[320px] shrink-0 flex-col rounded-[32px] border border-blue-100 bg-brand-950 p-6 text-white shadow-[0_24px_80px_rgba(16,16,16,0.16)] lg:flex">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-white overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/dashboard-logo.png" alt="CS Logo" className="h-8 w-auto object-contain" />
          </div>
          <div className="min-w-0 overflow-visible">
            <p className="text-[13px] font-semibold tracking-tight whitespace-nowrap">Kanzode <span className="text-white/50">&</span> Co.</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-white/60">
          Practice management for CA, CS, legal, and business advisory firms.
        </p>
      </div>

      <nav className="mt-8 space-y-2">
        {navigationItems.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/8 hover:text-white"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[28px] border border-brand-500/20 bg-brand-900 p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-brand-400">
          Portal Ready
        </p>
        <p className="mt-3 text-sm leading-6 text-white/65">
          Automated document delivery, share links, and real-time task tracking built in.
        </p>
      </div>
    </aside>
  );
}
