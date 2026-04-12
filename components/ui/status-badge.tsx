import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  onboarded: "bg-sky-100 text-sky-700",
  prospect: "bg-amber-100 text-amber-700",
  draft: "bg-slate-100 text-slate-700",
  sent: "bg-blue-100 text-blue-700",
  opened: "bg-violet-100 text-violet-700",
  approved: "bg-emerald-100 text-emerald-700",
  paid: "bg-green-100 text-green-700",
  overdue: "bg-rose-100 text-rose-700",
  pending: "bg-orange-100 text-orange-700"
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        statusStyles[status] ?? "bg-slate-100 text-slate-700"
      )}
    >
      {status}
    </span>
  );
}
