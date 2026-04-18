"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { deleteQuotationAction } from "@/app/actions";
import { toast } from "react-hot-toast";
import { Search, Trash2 } from "lucide-react";

export function SearchableQuotationList({
  quotations,
  clients
}: {
  quotations: any[];
  clients: any[];
}) {
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState<string | null>(null);

  const statuses = ["draft", "sent", "approved", "invoiced"];

  const filtered = quotations.filter((q) => {
    const term = search.toLowerCase();
    const clientMatch = clients.find((c) => c.id === q.clientId)?.companyName?.toLowerCase().includes(term);
    const statusMatch = activeStatus ? q.status === activeStatus : true;
    
    return (
      (q.quotationNumber.toLowerCase().includes(term) ||
      (q.challanNumber && q.challanNumber.toLowerCase().includes(term)) ||
      clientMatch) && statusMatch
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full rounded-full border-0 py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-brand-500"
            placeholder="Search by quote, challan, or client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveStatus(null)}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${activeStatus === null ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            All
          </button>
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setActiveStatus(s === activeStatus ? null : s)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${activeStatus === s ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
        Showing {filtered.length} {filtered.length === 1 ? 'Quotation' : 'Quotations'}
      </div>

      <DataTable
        columns={[
          {
            key: "quotationNumber",
            title: "Quote #",
            render: (value, row: any) => (
              <span className="font-semibold text-brand-700 hover:underline">
                {String(value)}
              </span>
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
              const client = clients.find((item: any) => item.id === value);
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
          },
          {
            key: "id",
            title: "Actions",
            align: "right",
            render: (value) => (
              <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                <Link href={`/quotations/${value}/edit`} className="px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors">
                  Edit
                </Link>
                <button
                  onClick={async () => {
                    if (confirm("Are you sure you want to delete this quotation?")) {
                      toast.loading("Deleting...", { id: "del" });
                      try {
                        await deleteQuotationAction(value as string);
                        toast.success("Deleted successfully!", { id: "del" });
                      } catch (e) {
                        toast.error("Failed to delete.", { id: "del" });
                      }
                    }
                  }}
                  className="px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded flex items-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          }
        ]}
        rows={filtered}
        rowHref={(row: any) => `/quotations/${row.id}`}
      />
    </div>
  );
}
