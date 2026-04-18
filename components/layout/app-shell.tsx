import { ReactNode } from "react";
import { TopHeader } from "@/components/layout/top-header";

interface AppShellProps {
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function AppShell({ title, description, actions, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-brand-50/30 text-slate-900 flex flex-col print:bg-white print:min-h-0">
      <div className="print:hidden">
        <TopHeader title={title} description={description} actions={actions} />
      </div>
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-4 px-4 py-4 md:px-6 print:px-0 print:py-0 print:gap-0 print:max-w-none">
        <main className="space-y-4 print:space-y-0 print:m-0 print:p-0">{children}</main>
      </div>
    </div>
  );
}
