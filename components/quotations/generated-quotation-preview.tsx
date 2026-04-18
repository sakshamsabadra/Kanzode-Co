"use client";

import { MockQuotationDraft } from "@/lib/quotation-generator";
import { QuotationLineItem } from "@/types";
import { formatCurrency } from "@/lib/format";
import { Plus, Trash2, Pencil } from "lucide-react";

interface GeneratedQuotationPreviewProps {
  draft: MockQuotationDraft | null;
  onChange?: (patch: Partial<MockQuotationDraft>) => void;
}

function recalcTotals(items: QuotationLineItem[], taxPercent: number) {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const taxAmount = Math.round((subtotal * taxPercent) / 100);
  return { subtotal, taxAmount, total: subtotal + taxAmount };
}

export function GeneratedQuotationPreview({ draft, onChange }: GeneratedQuotationPreviewProps) {
  if (!draft) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center text-sm text-slate-500">
        Generate a draft to see and edit line items, totals, notes, and terms.
      </div>
    );
  }

  const canEdit = !!onChange;

  /* ── Line item helpers ── */
  function updateLineItem(id: string, field: keyof QuotationLineItem, raw: string) {
    if (!onChange || !draft) return;
    const items = draft.lineItems.map((item) => {
      if (item.id !== id) return item;
      const updated = { ...item };
      if (field === "title") {
        updated.title = raw;
      } else if (field === "quantity") {
        updated.quantity = Math.max(1, Number(raw) || 1);
        updated.amount = updated.quantity * updated.unitPrice;
      } else if (field === "unitPrice") {
        updated.unitPrice = Math.max(0, Number(raw) || 0);
        updated.amount = updated.quantity * updated.unitPrice;
      }
      return updated;
    });
    onChange({ lineItems: items, ...recalcTotals(items, draft.taxPercent) });
  }

  function removeLineItem(id: string) {
    if (!onChange || !draft) return;
    const items = draft.lineItems.filter((item) => item.id !== id);
    onChange({ lineItems: items, ...recalcTotals(items, draft.taxPercent) });
  }

  function addLineItem() {
    if (!onChange || !draft) return;
    const newItem: QuotationLineItem = {
      id: `manual-${Date.now()}`,
      title: "New service",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    };
    const items = [...draft.lineItems, newItem];
    onChange({ lineItems: items, ...recalcTotals(items, draft.taxPercent) });
  }

  function updateTaxPercent(raw: string) {
    if (!onChange || !draft) return;
    const taxPercent = Math.min(100, Math.max(0, Number(raw) || 0));
    onChange({ taxPercent, ...recalcTotals(draft.lineItems, taxPercent) });
  }

  /* ── Terms helpers ── */
  function updateTerm(index: number, value: string) {
    if (!onChange || !draft) return;
    const terms = draft.terms.map((t, i) => (i === index ? value : t));
    onChange({ terms, suggestedTerms: terms });
  }

  function removeTerm(index: number) {
    if (!onChange || !draft) return;
    const terms = draft.terms.filter((_, i) => i !== index);
    onChange({ terms, suggestedTerms: terms });
  }

  function addTerm() {
    if (!onChange || !draft) return;
    onChange({ terms: [...draft.terms, ""] });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {/* Quotation type badge */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 bg-slate-50">
        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
          draft.quotationType === "direct_invoice"
            ? "bg-green-100 text-green-700"
            : "bg-slate-200 text-slate-600"
        }`}>
          {draft.quotationType === "direct_invoice" ? "Direct Invoice" : "Manual Quotation"}
        </span>
        <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest ${
          draft.urgency === "Urgent"
            ? "bg-amber-100 text-amber-700"
            : "bg-blue-100 text-blue-700"
        }`}>
          {draft.urgency}
        </span>
        <span className="ml-auto text-xs text-slate-500">{draft.validityLabel}</span>
      </div>

      {/* Line items table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-800 text-xs uppercase tracking-widest text-white">
              <th className="px-4 py-3 text-left font-semibold">Service / Description</th>
              <th className="px-3 py-3 text-right font-semibold w-16">Qty</th>
              <th className="px-3 py-3 text-right font-semibold w-28">Unit Rate (₹)</th>
              <th className="px-3 py-3 text-right font-semibold w-28">Amount (₹)</th>
              {canEdit && <th className="px-3 py-3 w-10" />}
            </tr>
          </thead>
          <tbody>
            {draft.lineItems.map((item) => (
              <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50 group">
                <td className="px-4 py-3">
                  {canEdit ? (
                    <input
                      value={item.title ?? ""}
                      onChange={(e) => updateLineItem(item.id, "title", e.target.value)}
                      className="w-full rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm font-medium text-slate-900 outline-none hover:border-slate-200 focus:border-blue-400 focus:bg-white transition"
                    />
                  ) : (
                    <span className="text-sm font-medium text-slate-900">{item.title}</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right">
                  {canEdit ? (
                    <input
                      type="number"
                      min={1}
                      value={item.quantity ?? 1}
                      onChange={(e) => updateLineItem(item.id, "quantity", e.target.value)}
                      className="w-14 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-right text-slate-700 outline-none hover:border-slate-200 focus:border-blue-400 focus:bg-white transition"
                    />
                  ) : (
                    <span className="text-sm text-slate-700">{item.quantity}</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right">
                  {canEdit ? (
                    <input
                      type="number"
                      min={0}
                      value={item.unitPrice ?? 0}
                      onChange={(e) => updateLineItem(item.id, "unitPrice", e.target.value)}
                      className="w-24 rounded-lg border border-transparent bg-transparent px-2 py-1 text-sm text-right text-slate-700 outline-none hover:border-slate-200 focus:border-blue-400 focus:bg-white transition"
                    />
                  ) : (
                    <span className="text-sm text-slate-700">{formatCurrency(item.unitPrice)}</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right">
                  <span className="text-sm font-semibold text-slate-900">{formatCurrency(item.amount)}</span>
                </td>
                {canEdit && (
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => removeLineItem(item.id)}
                      className="rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                      title="Remove row"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add row button */}
      {canEdit && (
        <button
          onClick={addLineItem}
          className="flex w-full items-center gap-2 border-t border-dashed border-slate-200 px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition"
        >
          <Plus className="h-4 w-4" />
          Add line item
        </button>
      )}

      {/* Totals */}
      <div className="grid gap-px bg-slate-100 border-t border-slate-200 md:grid-cols-[1fr_auto]">
        {/* Notes */}
        <div className="bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Notes</p>
          {canEdit ? (
            <textarea
              value={draft.notes ?? ""}
              onChange={(e) => onChange?.({ notes: e.target.value })}
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 min-h-[60px]"
            />
          ) : (
            <p className="text-sm text-slate-600 leading-6">{draft.notes}</p>
          )}
        </div>

        {/* Totals box */}
        <div className="bg-slate-800 text-white min-w-[220px] p-5 flex flex-col justify-center gap-3">
          <div className="flex items-center justify-between text-sm text-white/70">
            <span>Subtotal</span>
            <span>{formatCurrency(draft.subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-white/70 gap-2">
            <span>Tax (%)</span>
            {canEdit ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={draft.taxPercent ?? 0}
                  onChange={(e) => updateTaxPercent(e.target.value)}
                  className="w-14 rounded-lg bg-white/10 border border-white/20 px-2 py-1 text-right text-sm text-white outline-none focus:border-white/50"
                />
                <span className="text-white/60 text-xs">= {formatCurrency(draft.taxAmount)}</span>
              </div>
            ) : (
              <span>{draft.taxPercent}% = {formatCurrency(draft.taxAmount)}</span>
            )}
          </div>
          <div className="border-t border-white/20 pt-3 flex items-center justify-between font-bold text-base">
            <span>Total</span>
            <span>{formatCurrency(draft.total)}</span>
          </div>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Terms &amp; Conditions</p>
          {canEdit && (
            <button
              onClick={addTerm}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 transition"
            >
              <Plus className="h-3 w-3" />
              Add term
            </button>
          )}
        </div>
        <div className="space-y-2">
          {draft.terms.map((term, i) => (
            <div key={`term-${i}-${term.substring(0, 10)}`} className="flex items-start gap-2 group">
              <span className="mt-2.5 shrink-0 text-xs font-bold text-blue-400">{i + 1}.</span>
              {canEdit ? (
                <input
                  value={term ?? ""}
                  onChange={(e) => updateTerm(i, e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 bg-blue-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-blue-400 focus:bg-white transition"
                />
              ) : (
                <span className="flex-1 rounded-xl bg-blue-50 px-3 py-2 text-sm text-slate-700">{term}</span>
              )}
              {canEdit && (
                <button
                  onClick={() => removeTerm(i)}
                  className="mt-1 rounded-lg p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
