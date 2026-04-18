"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Building2, LayoutDashboard, FileText, ReceiptText, Users2, Wrench, CheckSquare } from "lucide-react";
import { navigationItems } from "@/lib/navigation";
import { usePathname } from "next/navigation";

interface TopHeaderProps {
  title: string;
  description: string;
  actions?: ReactNode;
}

const iconMap: Record<string, any> = {
  dashboard: LayoutDashboard,
  clients: Users2,
  services: Wrench,
  quotations: FileText,
  invoices: ReceiptText,
  tasks: CheckSquare
};

export function TopHeader({ title, description, actions }: TopHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="border-b border-blue-100 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center gap-8 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/dashboard-logo.png" alt="CS Logo" className="h-8 w-auto object-contain" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-brand-900">Kanzode and Co</span>
        </div>

        <nav className="flex h-full items-center space-x-6">
          {navigationItems.map((item) => {
            const Icon = iconMap[item.icon];
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex h-full items-center border-b-2 px-1 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-brand-600 text-brand-900"
                    : "border-transparent text-slate-500 hover:border-brand-300 hover:text-brand-700"
                }`}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-brand-900">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}
