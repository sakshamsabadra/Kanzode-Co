"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Building2, LayoutDashboard, FileText, ReceiptText, Users2 } from "lucide-react";
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
  quotations: FileText,
  invoices: ReceiptText
};

export function TopHeader({ title, description, actions }: TopHeaderProps) {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center gap-8 px-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center bg-slate-900 text-white rounded-md">
            <Building2 className="h-4 w-4" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-slate-900">Advisory OS</span>
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
                    ? "border-slate-900 text-slate-900"
                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
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
          <h1 className="text-xl font-semibold tracking-tight text-slate-900">
            {title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
        {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
      </div>
    </header>
  );
}
