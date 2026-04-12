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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <TopHeader title={title} description={description} actions={actions} />
      <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-4 px-4 py-4 md:px-6">
        <main className="space-y-4">{children}</main>
      </div>
    </div>
  );
}
