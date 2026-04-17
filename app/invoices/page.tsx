import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { DataTable } from "@/components/ui/data-table";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import * as dataService from "@/lib/data-service";
import { formatCurrency, formatDateTime } from "@/lib/format";
import Link from "next/link";

export default async function InvoicesPage() {
  const invoices = await dataService.getInvoices();
  const clients = await dataService.getClients();

  // Normalize for rendering
  const normalizedInvoices = JSON.parse(JSON.stringify(invoices));
  const normalizedClients = JSON.parse(JSON.stringify(clients));

  return (
    <AppShell
      title="Invoices"
      description="All invoices with payment tracking, challan numbers, and due dates."
      actions={
        <ActionButton href="/quotations/new">New quotation</ActionButton>
      }
    >
      <Panel
        eyebrow="Collections"
        title="Invoice list"
        description="Click any invoice to view details, record payment, or share."
      >
        <DataTable
          columns={[
            {
              key: "invoiceNumber",
              title: "Invoice #",
              render: (value, row: any) => (
                <Link href={`/invoices/${row.id}`} className="font-semibold text-brand-700 hover:underline">
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
              key: "total",
              title: "Total",
              align: "right",
              render: (value) => (
                <span className="font-semibold text-slate-900">
                  {formatCurrency(Number(value))}
                </span>
              )
            },
            {
              key: "paidAmount",
              title: "Paid",
              align: "right",
              render: (value) => (
                <span className="text-sm text-slate-600">
                  {formatCurrency(Number(value))}
                </span>
              )
            },
            {
              key: "dueDate",
              title: "Due Date",
              render: (value) => (
                <span className="text-sm text-slate-500">{formatDateTime(String(value))}</span>
              )
            },
            {
              key: "paymentStatus",
              title: "Status",
              render: (value) => <StatusBadge status={String(value)} />
            }
          ]}
          rows={normalizedInvoices}
        />
      </Panel>
    </AppShell>
  );
}
