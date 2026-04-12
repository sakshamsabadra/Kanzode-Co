import { Client } from "@/types";
import { formatCurrency, formatDateTime } from "@/lib/format";

export function ClientSummaryCard({ client }: { client: Client }) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Client summary</p>
          <h3 className="mt-2 text-xl font-semibold text-slate-950">
            {client.companyName}
          </h3>
          <p className="mt-1 text-sm text-slate-600">
            {client.name} · {client.email} · {client.whatsappNumber}
          </p>
        </div>
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-700">
          {client.clientType.replace("_", " ")}
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pricing anchor</p>
          <p className="mt-2 font-semibold text-slate-900">
            {formatCurrency(client.pricingPreferences?.anchorAmount ?? 0)}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">GST</p>
          <p className="mt-2 font-semibold text-slate-900">
            {client.gstNumber ?? "Not captured"}
          </p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Past services</p>
          <p className="mt-2 font-semibold text-slate-900">{client.pastServices.length}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Updated</p>
          <p className="mt-2 font-semibold text-slate-900">
            {formatDateTime(client.updatedAt)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {client.standardTerms.map((term) => (
          <span
            key={term}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600"
          >
            {term}
          </span>
        ))}
      </div>
    </div>
  );
}
