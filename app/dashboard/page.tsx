import { Activity, FileText, Receipt, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import * as dataService from "@/lib/data-service";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { RecentQuotationsTable, InvoiceWatchlist } from "@/components/dashboard/dashboard-tables";

export default async function DashboardPage() {
  let clients: any[] = [];
  let quotations: any[] = [];
  let invoices: any[] = [];
  let activityLogs: any[] = [];

  try {
    clients = await dataService.getClients();
    quotations = await dataService.getQuotations();
    invoices = await dataService.getInvoices();
    activityLogs = await dataService.getActivityLogs();
  } catch (error) {
    console.error("Failed to load dashboard data:", error);
  }

  // Normalize IDs for easier matching
  const normalizedClients = JSON.parse(JSON.stringify(clients));
  const normalizedQuotations = JSON.parse(JSON.stringify(quotations));
  const normalizedInvoices = JSON.parse(JSON.stringify(invoices));
  const normalizedLogs = JSON.parse(JSON.stringify(activityLogs));

  const liveQuotations = normalizedQuotations.filter((q: any) => q.status !== "invoiced");
  const totalPipeline = liveQuotations.reduce((sum: number, item: any) => sum + item.total, 0);
  const overdueInvoices = normalizedInvoices.filter((item: any) => item.paymentStatus === "overdue");

  return (
    <AppShell
      title="Dashboard"
      description="A premium control room for quotations, invoices, client memory, and recent advisory activity."
      actions={
        <>
          <ActionButton href="/quotations/new">New quotation</ActionButton>
          <ActionButton href="/clients" variant="secondary">
            View clients
          </ActionButton>
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          href="/clients"
          title="Active clients"
          value={String(clients.length).padStart(2, "0")}
          description="Client records with pricing memory and standard terms."
          icon={<Users className="h-5 w-5" />}
          trend="+12% this quarter"
        />
        <DashboardCard
          title="Quotation pipeline"
          href="/quotations"
          value={formatCurrency(totalPipeline)}
          description="Open proposals currently under review or awaiting approval."
          icon={<FileText className="h-5 w-5" />}
          trend={`${liveQuotations.length} live quotations`}
        />
        <DashboardCard
          title="Invoices due"
          href="/invoices"
          value={String(overdueInvoices.length).padStart(2, "0")}
          description="Collections needing follow-up this week."
          icon={<Receipt className="h-5 w-5" />}
          trend={`${overdueInvoices.length > 0 ? overdueInvoices.length : 'No'} require attention`}
        />
        <DashboardCard
          title="Recent activity"
          value={String(activityLogs.length)}
          description="Client opens, approvals, WhatsApp sends, and payment updates."
          icon={<Activity className="h-5 w-5" />}
          trend="Live feed"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.95fr]">
        <RecentQuotationsTable 
          quotations={liveQuotations.slice(0, 4)} 
          clients={normalizedClients} 
        />
        <InvoiceWatchlist 
          invoices={normalizedInvoices.slice(0, 3)} 
          clients={normalizedClients} 
        />
      </section>

      <section>
        <Panel
          eyebrow="Activity"
          title="System Logs"
          description="Real-time log of background jobs, document status, and pipeline operations."
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {normalizedLogs.slice(0, 8).map((item: any) => (
              <div
                key={item.id || item._id}
                className="flex flex-col gap-3 justify-between rounded-3xl border border-slate-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-slate-900 line-clamp-1">{item.action}</p>
                  <StatusBadge status={item.action} />
                </div>
                <p className="text-sm text-slate-600 line-clamp-2">{item.message}</p>
                <p className="mt-auto text-xs font-semibold uppercase tracking-widest text-brand-400">
                  {formatDateTime(item.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </Panel>
      </section>
    </AppShell>
  );
}
