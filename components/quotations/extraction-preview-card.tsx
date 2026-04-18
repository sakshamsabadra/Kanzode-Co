"use client";

import { MockQuotationDraft } from "@/lib/quotation-generator";
import { QuotationType } from "@/types";
import { Zap, Clock, Trash2 } from "lucide-react";

interface ExtractionPreviewCardProps {
  draft: MockQuotationDraft | null;
  onChange?: (patch: Partial<MockQuotationDraft>) => void;
}

export function ExtractionPreviewCard({ draft, onChange }: ExtractionPreviewCardProps) {
  if (!draft) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
        Click &ldquo;Analyze &amp; Generate Draft&rdquo; to preview matched services, urgency, and terms.
      </div>
    );
  }

  const isUrgent = draft.urgency === "Urgent";

  function toggleUrgency() {
    if (!onChange || !draft) return;
    const newUrgency = isUrgent ? "Standard" : "Urgent";
    onChange({
      urgency: newUrgency,
      validityLabel: newUrgency === "Urgent" ? "Valid for 3 days" : "Valid for 7 days",
      notes:
        newUrgency === "Urgent"
          ? "Priority delivery assumed. Draft can be positioned as urgent same-day support."
          : "Standard delivery window applied. Scope can be tightened further before sending.",
    });
  }

  function setQuotationType(qt: QuotationType) {
    if (!onChange || !draft) return;
    onChange({ quotationType: qt });
  }

  function removeService(id: string) {
    if (!onChange || !draft) return;
    onChange({
      extractedServices: draft.extractedServices.filter((s) => s.id !== id),
    });
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      {/* Urgency toggle + Quotation type selector */}
      <div className="grid grid-cols-2 gap-px bg-slate-100 border-b border-slate-200">
        {/* Urgency toggle */}
        <div className="bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Urgency</p>
          <div className="flex gap-2">
            <button
              onClick={toggleUrgency}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                !isUrgent
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              Standard
            </button>
            <button
              onClick={toggleUrgency}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                isUrgent
                  ? "bg-amber-500 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              Urgent
            </button>
          </div>
          {isUrgent && (
            <p className="mt-2 text-xs text-amber-600">
              ⚠ 15% urgency uplift applied to unit prices
            </p>
          )}
        </div>

        {/* Quotation type */}
        <div className="bg-white p-4">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Quotation Type</p>
          <div className="flex gap-2">
            <button
              onClick={() => setQuotationType("manual")}
              className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                draft.quotationType === "manual"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Manual
            </button>
            <button
              onClick={() => setQuotationType("direct_invoice")}
              className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                draft.quotationType === "direct_invoice"
                  ? "bg-slate-800 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Direct Invoice
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {draft.quotationType === "direct_invoice"
              ? "Will skip approval and go straight to invoice"
              : "Requires review and approval before invoicing"}
          </p>
        </div>
      </div>

      {/* Extracted Services */}
      <div className="p-4 border-b border-slate-100">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
          Extracted Services ({draft.extractedServices.length})
        </p>
        {draft.extractedServices.length === 0 ? (
          <p className="text-sm text-slate-500 italic">No services matched — add line items manually below.</p>
        ) : (
          <div className="space-y-2">
            {draft.extractedServices.map((service) => (
              <div
                key={service.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm">{service.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500 truncate">{service.whyMatched}</p>
                </div>
                {onChange && (
                  <button
                    onClick={() => removeService(service.id)}
                    className="shrink-0 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 transition"
                    title="Remove service"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggested Terms */}
      <div className="p-4">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Suggested Terms</p>
        <div className="space-y-1.5">
          {draft.suggestedTerms.map((term, i) => (
            <div key={i} className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-slate-700">
              {term}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
