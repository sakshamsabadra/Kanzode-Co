export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { convertSavedQuotationToInvoice, sendSavedQuotation } from "@/app/actions";
import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { ShareButton, PrintButton } from "@/components/ui/client-actions";
import { StatusBadge } from "@/components/ui/status-badge";
import * as dataService from "@/lib/data-service";
import { formatCurrency, formatDateTime } from "@/lib/format";

export default async function QuotationDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quotation: any = await dataService.getQuotationById(id);

  if (!quotation) {
    notFound();
  }

  const client: any = await dataService.getClientById(quotation.clientId.toString());
  const party: any = quotation.partyId ? await dataService.getPartyById(quotation.partyId.toString()) : null;

  async function handleConvert() {
    "use server";
    const invId = await convertSavedQuotationToInvoice(quotation!.id);
    redirect(`/invoices/${invId}`);
  }

  async function handleSend() {
    "use server";
    await sendSavedQuotation(quotation!.id);
    redirect(`/quotations/${quotation!.id}`);
  }

  return (
    <AppShell
      title={quotation.quotationNumber}
      description="Quotation detail with challan number, service scope, pricing, and terms."
      actions={
        <form className="flex gap-3 no-print">
          <ActionButton formAction={convertSavedQuotationToInvoice.bind(null, id)}>
            Convert to invoice
          </ActionButton>
          <ActionButton formAction={sendSavedQuotation.bind(null, id)} variant="secondary">
            Deliver via portal
          </ActionButton>
          <ShareButton />
          <PrintButton />
        </form>
      }
    >
      <article className="print-document mx-auto w-full max-w-4xl rounded-[6px] border border-slate-200 bg-white p-8 md:p-16">
        {/* Document Header */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-10 md:flex-row">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">QUOTATION</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">{quotation.quotationNumber}</p>
            <p className="mt-1 text-sm text-slate-400">Challan: {quotation.challanNumber}</p>
            <div className="mt-4 flex gap-2">
              <StatusBadge status={quotation.status} />
              <StatusBadge status={quotation.quotationType === "direct_invoice" ? "direct_invoice" : "manual"} />
            </div>
          </div>
          <div className="text-left text-sm text-slate-600 md:text-right">
            <p className="font-bold text-slate-900">Kanzode and Co</p>
            <p className="mt-1">123 Corporate Avenue, Tech Park</p>
            <p>billing@kanzode.co</p>
          </div>
        </div>

        {/* Client & Party Info block */}
        <div className="mt-10 flex flex-col justify-between gap-8 md:flex-row">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Prepared For</p>
            <div className="mt-3 text-sm text-slate-900">
              <p className="font-bold">{client?.companyName ?? "Unknown Client"}</p>
              <p className="mt-1 text-slate-600">{client?.name}</p>
              <p className="text-slate-600">{client?.email}</p>
              {client?.address && <p className="text-slate-600">{client.address}</p>}
            </div>
            {party && (
              <div className="mt-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Party</p>
                <div className="mt-2 text-sm text-slate-900">
                  <p className="font-bold">{party.name}</p>
                  <p className="text-slate-600">{party.address}</p>
                  <p className="text-slate-600">{party.email} · {party.phoneNumber}</p>
                </div>
              </div>
            )}
          </div>
          <div className="text-sm">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-slate-600 md:text-right">
              <span className="font-medium text-slate-500">Date Issued:</span>
              <span className="text-slate-900">{formatDateTime(quotation.createdAt)}</span>
              <span className="font-medium text-slate-500">Challan No:</span>
              <span className="text-slate-900">{quotation.challanNumber}</span>
              <span className="font-medium text-slate-500">Validity:</span>
              <span className="text-slate-900">{quotation.validityDays} Days</span>
              <span className="font-medium text-slate-500">Type:</span>
              <span className="text-slate-900">{quotation.quotationType === "direct_invoice" ? "Direct Invoice" : "Manual"}</span>
            </div>
          </div>
        </div>

        {/* Line Items Table - border names only, no narrations */}
        <div className="mt-16 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300 text-slate-500">
                <th className="pb-3 font-bold uppercase tracking-widest text-xs">Item</th>
                <th className="pb-3 text-right font-bold uppercase tracking-widest text-xs">Rate</th>
                <th className="pb-3 text-right font-bold uppercase tracking-widest text-xs">Qty</th>
                <th className="pb-3 text-right font-bold uppercase tracking-widest text-xs">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {quotation.lineItems.map((item: any, index: number) => (
                <tr key={`${item.id}-${index}`}>
                  <td className="py-4 pr-4">
                    <p className="font-bold text-slate-900">{item.title}</p>
                  </td>
                  <td className="py-4 text-right text-slate-600">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-4 text-right text-slate-600">{item.quantity}</td>
                  <td className="py-4 text-right font-bold text-slate-900">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="mt-8 flex justify-end">
          <div className="w-full max-w-sm rounded-[6px] border border-slate-200 bg-slate-50 p-6">
            <div className="mb-3 flex justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <span>{formatCurrency(quotation.subtotal)}</span>
            </div>
            <div className="mb-4 flex justify-between border-b border-slate-200 pb-4 text-sm text-slate-600">
              <span>Tax ({quotation.taxPercent}%)</span>
              <span>{formatCurrency(quotation.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>{formatCurrency(quotation.total)}</span>
            </div>
          </div>
        </div>

        {/* Terms */}
        <div className="mt-16 border-t border-slate-200 pt-8">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Notes & Terms</p>
          {quotation.notes && (
            <p className="mt-4 text-sm leading-relaxed text-slate-600">{quotation.notes}</p>
          )}
          <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-slate-600">
            {quotation.terms.map((term: string, i: number) => (
              <li key={i}>{term}</li>
            ))}
          </ul>
        </div>
      </article>
    </AppShell>
  );
}
