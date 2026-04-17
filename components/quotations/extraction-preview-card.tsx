import { MockQuotationDraft } from "@/lib/quotation-generator";

export function ExtractionPreviewCard({ draft }: { draft: MockQuotationDraft | null }) {
  if (!draft) {
    return (
      <div className="rounded-none border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
        Run extraction to preview matched services, urgency, suggested terms, and pricing hints.
      </div>
    );
  }

  return (
    <div className="rounded-none border border-slate-200 bg-white p-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-none bg-slate-50 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Urgency</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">{draft.urgency}</p>
        </div>
        <div className="rounded-none bg-slate-50 px-4 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Client type</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">
            {draft.clientType.replace("_", " ")}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Extracted services</p>
          <div className="mt-3 space-y-2">
            {draft.extractedServices.map((service) => (
              <div
                key={service.id}
                className="rounded-none border border-slate-200 bg-slate-50 px-4 py-3"
              >
                <p className="font-medium text-slate-900">{service.name}</p>
                <p className="mt-1 text-sm text-slate-600">{service.whyMatched}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Suggested terms</p>
            <div className="mt-3 space-y-2">
              {draft.suggestedTerms.map((term, index) => (
                <div
                  key={`${term}-${index}`}
                  className="rounded-none bg-slate-50 px-4 py-3 text-sm text-slate-600"
                >
                  {term}
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pricing hints</p>
            <div className="mt-3 space-y-2">
              {draft.pricingHints.map((hint, index) => (
                <div
                  key={`${hint}-${index}`}
                  className="rounded-none bg-slate-100 px-4 py-3 text-sm text-slate-700"
                >
                  {hint}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
