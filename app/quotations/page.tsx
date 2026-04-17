import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { DataTable } from "@/components/ui/data-table";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import * as dataService from "@/lib/data-service";
import { formatCurrency, formatDateTime } from "@/lib/format";
import Link from "next/link";

export default async function QuotationsPage() {
  const quotations = await dataService.getQuotations();
  const clients = await dataService.getClients();

  // Normalize for rendering
  const normalizedQuotations = JSON.parse(JSON.stringify(quotations));
  const normalizedClients = JSON.parse(JSON.stringify(clients));

  return (
    <AppShell
      title="Quotations"
      description="All quotations with status tracking, challan numbers, and conversion options."
      actions={
        <ActionButton href="/quotations/new">New quotation</ActionButton>
      }
    >
      <Panel
        eyebrow="Pipeline"
        title="Quotation list"
        description="Click any quotation to view details, edit, convert to invoice, or share."
      >
        <DataTable
          columns={[
            {
              key: "quotationNumber",
              title: "Quote #",
              render: (value, row: any) => (
                <Link href={`/quotations/${row.id}`} className="font-semibold text-brand-700 hover:underline">
                  {String(value)}
                </Link>
              )
            },
            {
              key: "challanNumber",
              title: "Challan #",
              render: (value) => (
                <span className="text-sm text-slate-600">{String(value)}</span>
              )
            },
            {
              key: "clientId",
              title: "Client",
              render: (value) => {
                const client = normalizedClients.find((item: any) => item.id === value);
                return client?.companyName ?? "Unknown client";
              }
            },
            {
              key: "quotationType",
              title: "Type",
              render: (value) => (
                <span className="text-sm text-slate-600">
                  {String(value) === "direct_invoice" ? "Direct Invoice" : "Manual"}
                </span>
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
            },
            {
              key: "createdAt",
              title: "Date",
              render: (value) => (
                <span className="text-sm text-slate-500">{formatDateTime(String(value))}</span>
              )
            }
          ]}
          rows={normalizedQuotations}
        />
      </Panel>
    </AppShell>
  );
}
