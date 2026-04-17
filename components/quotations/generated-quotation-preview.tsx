import { MockQuotationDraft } from "@/lib/quotation-generator";
import { formatCurrency } from "@/lib/format";
import { StatusBadge } from "@/components/ui/status-badge";

export function GeneratedQuotationPreview({
  draft
}: {
  draft: MockQuotationDraft | null;
}) {
  if (!draft) {
    return (
      <div className="border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
        Generate a quotation to see line items, totals, validity, notes, and terms here.
      </div>
    );
  }

  return (
    <div className="border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-3 mb-4">
        <StatusBadge status={draft.quotationType} />
        <span className="text-sm text-slate-500">
          {draft.quotationType === "direct_invoice" ? "Will convert directly to invoice" : "Manual quotation for review"}
        </span>
      </div>

      <div className="overflow-hidden border border-slate-200">
        <div className="grid grid-cols-[1.6fr_0.6fr_0.7fr_0.7fr] border-b border-slate-200 bg-brand-50 px-4 py-3 text-xs uppercase tracking-[0.22em] text-brand-800">
          <div>Item</div>
          <div className="text-right">Qty</div>
          <div className="text-right">Rate</div>
          <div className="text-right">Amount</div>
        </div>

        {draft.lineItems.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-[1.6fr_0.6fr_0.7fr_0.7fr] border-b border-slate-100 px-4 py-4 last:border-b-0"
          >
            <div className="pr-4">
              <p className="font-medium text-slate-900">{item.title}</p>
            </div>
            <div className="text-right text-sm text-slate-700">{item.quantity}</div>
            <div className="text-right text-sm text-slate-700">
              {formatCurrency(item.unitPrice)}
            </div>
            <div className="text-right text-sm font-semibold text-slate-900">
              {formatCurrency(item.amount)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-3">
          <div className="bg-brand-50 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-800">Validity</p>
            <p className="mt-2 font-semibold text-slate-900">{draft.validityLabel}</p>
          </div>
          <div className="bg-brand-50 px-4 py-4">
            <p className="text-xs uppercase tracking-[0.2em] text-brand-800">Notes</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">{draft.notes}</p>
          </div>
        </div>

        <div className="bg-brand-900 px-5 py-5 text-white">
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>Subtotal</span>
            <span>{formatCurrency(draft.subtotal)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm text-white/70">
            <span>Tax ({draft.taxPercent}%)</span>
            <span>{formatCurrency(draft.taxAmount)}</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatCurrency(draft.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Terms and conditions</p>
        <div className="mt-3 space-y-2">
          {draft.terms.map((term, index) => (
            <div
              key={`${term}-${index}`}
              className="bg-brand-50 px-4 py-3 text-sm text-slate-600"
            >
              {term}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
