import Link from "next/link";
import { Building2, LayoutDashboard, FileText, ReceiptText, Users2 } from "lucide-react";
import { navigationItems } from "@/lib/navigation";

const iconMap = {
  dashboard: LayoutDashboard,
  clients: Users2,
  quotations: FileText,
  invoices: ReceiptText
};

export function SidebarNav() {
  return (
    <aside className="hidden w-[280px] shrink-0 flex-col rounded-[32px] border border-white/70 bg-[#121212] p-6 text-white shadow-[0_24px_80px_rgba(16,16,16,0.16)] lg:flex">
      <div className="rounded-[28px] border border-white/10 bg-white/5 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#c49b5a] text-[#121212]">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-white/45">Aurum</p>
            <p className="text-lg font-semibold">Advisory Suite</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-6 text-white/60">
          Premium demo cockpit for CA, CS, legal, and business advisory teams.
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

      <div className="mt-auto rounded-[28px] border border-[#c49b5a]/20 bg-[#1d1d1d] p-5">
        <p className="text-xs uppercase tracking-[0.24em] text-[#c49b5a]">
          Demo Readiness
        </p>
        <p className="mt-3 text-sm leading-6 text-white/65">
          Structure is ready for AI generation, mailer hooks, WhatsApp delivery,
          and a real database when you want to move beyond mock storage.
        </p>
      </div>
    </aside>
  );
}
