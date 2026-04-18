"use client";

import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { Panel } from "@/components/ui/panel";
import Link from "next/link";

export function RecentQuotationsTable({ 
  quotations, 
  clients 
}: { 
  quotations: any[], 
  clients: any[] 
}) {
  return (
    <Panel
      eyebrow="Pipeline"
      title="Recent Quotations"
      description="Monitor active proposals and finalized drafts."
    >
      <DataTable
        columns={[
          { key: "quotationNumber", title: "Quote" },
          {
            key: "clientId",
            title: "Client",
            render: (value) => {
              const client = clients.find((item: any) => (item.id || item._id) === value);
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
          },
          {
            key: "id",
            title: "Action",
            align: "right",
            render: (value) => (
              <Link 
                href={`/quotations/${value}/edit`}
                onClick={(e) => e.stopPropagation()}
                className="px-2 py-1 text-[10px] font-bold uppercase text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors"
              >
                Edit
              </Link>
            )
          }
        ]}
        rows={quotations}
        rowHref={(row: any) => `/quotations/${row.id || row._id}`}
      />
    </Panel>
  );
}

export function InvoiceWatchlist({ 
  invoices, 
  clients 
}: { 
  invoices: any[], 
  clients: any[] 
}) {
  return (
    <Panel
      eyebrow="Collections"
      title="Invoice Watchlist"
      description="Track outstanding and overdue collections."
    >
      <div className="space-y-3">
        {invoices.map((invoice: any) => (
          <Link
            key={invoice.id || invoice._id}
            href={`/invoices/${invoice.id || invoice._id}`}
            className="block rounded-3xl border border-slate-200 bg-white px-5 py-4 transition-transform hover:scale-[1.02] hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {invoice.invoiceNumber}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {clients.find((item: any) => (item.id || item._id) === invoice.clientId)?.companyName}
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
          </Link>
        ))}
      </div>
    </Panel>
  );
}
