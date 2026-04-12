import { Activity, ArrowRightLeft, FileText, Receipt, Users } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { DashboardCard } from "@/components/ui/dashboard-card";
import { DataTable } from "@/components/ui/data-table";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  getActivityLogs,
  getClients,
  getInvoices,
  getQuotations
} from "@/lib/mock-storage";
import { formatCurrency, formatDateTime } from "@/lib/format";

export default function DashboardPage() {
  const clients = getClients();
  const quotations = getQuotations();
  const invoices = getInvoices();
  const activityLogs = getActivityLogs();
  const totalPipeline = quotations.reduce((sum, item) => sum + item.total, 0);
  const overdueInvoices = invoices.filter((item) => item.paymentStatus === "overdue");

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
          title="Active clients"
          value={String(clients.length).padStart(2, "0")}
          description="Seeded client records with pricing memory and standard terms."
          icon={<Users className="h-5 w-5" />}
          trend="+12% this quarter"
        />
        <DashboardCard
          title="Quotation pipeline"
          value={formatCurrency(totalPipeline)}
          description="Open proposals currently under review or awaiting approval."
          icon={<FileText className="h-5 w-5" />}
          trend="7 live quotations"
        />
        <DashboardCard
          title="Invoices due"
          value={String(overdueInvoices.length).padStart(2, "0")}
          description="Collections needing follow-up this week."
          icon={<Receipt className="h-5 w-5" />}
          trend="2 require escalation"
        />
        <DashboardCard
          title="Recent activity"
          value="18"
          description="Client opens, approvals, WhatsApp sends, and payment updates."
          icon={<Activity className="h-5 w-5" />}
          trend="Live mock feed"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.25fr_0.95fr]">
        <Panel
          eyebrow="Pipeline"
          title="Recent quotations"
          description="Use this as the base pattern for dashboard tables across the product."
        >
          <DataTable
            columns={[
              { key: "quotationNumber", title: "Quote" },
              {
                key: "clientId",
                title: "Client",
                render: (value) => {
                  const client = clients.find((item) => item.id === value);
                  return client?.companyName ?? "Unknown client";
                }
              },
              {
                key: "extractedIntent",
                title: "Intent",
                render: (value) => (
                  <span className="text-sm text-slate-600">{String(value)}</span>
                )
              },
              {
                key: "total",
                title: "Value",
                align: "right",
                render: (value) => (
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(Number(value))}
                  </span>
                )
              },
              {
                key: "status",
                title: "Status",
                render: (value) => <StatusBadge status={String(value)} />
              }
            ]}
            rows={quotations.slice(0, 4)}
          />
        </Panel>

        <Panel
          eyebrow="Collections"
          title="Invoice watchlist"
          description="Premium collection tracking with clear status color-coding."
        >
          <div className="space-y-3">
            {invoices.slice(0, 3).map((invoice) => (
              <div
                key={invoice.id}
                className="rounded-3xl border border-slate-200 bg-white px-5 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {invoice.invoiceNumber}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {clients.find((item) => item.id === invoice.clientId)?.companyName}
                    </p>
                  </div>
                  <StatusBadge status={invoice.paymentStatus} />
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-500">{formatDateTime(invoice.dueDate)}</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.95fr_1.25fr]">
        <Panel
          eyebrow="Operations"
          title="Suggested workflow"
          description="A lightweight process block for demo storytelling and implementation planning."
        >
          <div className="space-y-4">
            {[
              "Capture WhatsApp or email request",
              "Suggest package from client type and service need",
              "Generate quotation with saved terms and historic pricing",
              "Convert approved quotation into invoice instantly",
              "Track send, open, payment, and overdue states"
            ].map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-4 rounded-3xl bg-slate-50 px-4 py-4"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {index + 1}
                </div>
                <div className="flex items-center gap-3 text-sm font-medium text-slate-700">
                  <span>{step}</span>
                  {index < 4 ? <ArrowRightLeft className="h-4 w-4 text-slate-300" /> : null}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          eyebrow="Activity"
          title="Latest logs"
          description="Mock events give every page realistic, production-style context."
        >
          <div className="space-y-3">
            {activityLogs.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-slate-200 bg-white px-5 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold text-slate-900">{item.action}</p>
                    <p className="mt-1 text-sm text-slate-600">{item.message}</p>
                  </div>
                  <StatusBadge status={item.action} />
                </div>
                <p className="mt-4 text-xs uppercase tracking-[0.22em] text-slate-400">
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
