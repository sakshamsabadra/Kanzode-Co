export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { ShareButton, PrintButton } from "@/components/ui/client-actions";
import { StatusBadge } from "@/components/ui/status-badge";
import * as dataService from "@/lib/data-service";
import { markInvoicePaidAction } from "@/app/actions";
import { formatCurrency, formatDateTime } from "@/lib/format";

export default async function InvoiceDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice: any = await dataService.getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  const client: any = await dataService.getClientById(invoice.clientId.toString());
  const quotation: any = invoice.quotationId ? await dataService.getQuotationById(invoice.quotationId.toString()) : null;
  const party: any = invoice.partyId ? await dataService.getPartyById(invoice.partyId.toString()) : null;

  return (
    <AppShell
      title={invoice.invoiceNumber}
      description="Invoice detail with challan number, payment tracking, and due date."
      actions={
        <form className="flex gap-3 no-print">
          <ActionButton formAction={markInvoicePaidAction.bind(null, id)} disabled={invoice.paymentStatus === "paid"}>
            Record payment
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
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">TAX INVOICE</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">{invoice.invoiceNumber}</p>
            <p className="mt-1 text-sm text-slate-400">Challan: {invoice.challanNumber}</p>
            {quotation && (
              <p className="mt-1 text-xs text-slate-400">Ref: {quotation.quotationNumber}</p>
            )}
            <div className="mt-4">
              <StatusBadge status={invoice.paymentStatus} />
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
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Billed To</p>
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
              <span className="font-medium text-slate-500">Invoice Date:</span>
              <span className="text-slate-900">{formatDateTime(invoice.issueDate)}</span>
              <span className="font-medium text-slate-500">Challan No:</span>
              <span className="text-slate-900">{invoice.challanNumber}</span>
              <span className="font-medium text-slate-500">Due Date:</span>
              <span className="text-slate-900">{formatDateTime(invoice.dueDate)}</span>
              <span className="font-medium text-slate-500">Paid Amount:</span>
              <span className="text-slate-900">{formatCurrency(invoice.paidAmount)}</span>
              <span className="font-medium text-slate-500">Balance:</span>
              <span className="font-semibold text-slate-900">{formatCurrency(invoice.total - invoice.paidAmount)}</span>
              {invoice.paymentStatus === "paid" && invoice.paidAt && (
                <>
                  <span className="font-medium text-slate-500">Paid On:</span>
                  <span className="text-slate-900">{formatDateTime(invoice.paidAt)}</span>
                </>
              )}
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
              {invoice.lineItems.map((item: any, index: number) => (
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
              <span>{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="mb-4 flex justify-between border-b border-slate-200 pb-4 text-sm text-slate-600">
              <span>Tax ({invoice.taxPercent}%)</span>
              <span>{formatCurrency(invoice.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900">
              <span>Total Due</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
            {invoice.paidAmount > 0 && (
              <div className="mt-3 flex justify-between text-sm font-semibold text-emerald-700">
                <span>Paid</span>
                <span>{formatCurrency(invoice.paidAmount)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Terms */}
        <div className="mt-16 border-t border-slate-200 pt-8">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Payment Terms</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-600">
            Payment is due by {formatDateTime(invoice.dueDate)}. Please include invoice number {invoice.invoiceNumber} on all transfers.
          </p>
          <div className="mt-4 rounded-[6px] bg-slate-50 p-4 text-sm text-slate-600">
            <p className="font-bold text-slate-900 mb-1">Bank Details</p>
            <p>Account Name: Kanzode and Co</p>
            <p>Account No: 10002930491823</p>
            <p>IFSC: RTB000100</p>
          </div>
        </div>
      </article>
    </AppShell>
  );
}
