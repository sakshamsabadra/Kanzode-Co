export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { getClientById, getInvoices, getQuotationById, updateInvoiceStatus } from "@/lib/mock-storage";
import { formatCurrency, formatDateTime } from "@/lib/format";

export default async function InvoiceDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice = getInvoices().find((item) => item.id === id);

  if (!invoice) {
    notFound();
  }

  const client = getClientById(invoice.clientId);
  const quotation = getQuotationById(invoice.quotationId);

  async function handleMarkPaid() {
    "use server";
    updateInvoiceStatus(invoice!.id, "paid");
    redirect(`/invoices/${invoice!.id}`);
  }

  return (
    <AppShell
      title={invoice.invoiceNumber}
      description="Invoice detail view for payment tracking, due dates, and commercial follow-up."
      actions={
        <form className="flex gap-3">
          <ActionButton formAction={handleMarkPaid} disabled={invoice.paymentStatus === "paid"}>
            Record payment
          </ActionButton>
          <ActionButton formAction={async () => { "use server"; /* reminder simulation */ redirect(`/invoices/${invoice!.id}`); }} variant="secondary">
            Send reminder
          </ActionButton>
        </form>
      }
    >
      <article className="mx-auto w-full max-w-4xl rounded-[6px] border border-slate-200 bg-white p-8 md:p-16">
        {/* Document Header */}
        <div className="flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-10 md:flex-row">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">TAX INVOICE</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">{invoice.invoiceNumber}</p>
            <p className="mt-1 text-xs text-slate-400">Ref: {quotation?.quotationNumber ?? invoice.quotationId}</p>
            <div className="mt-4">
              <StatusBadge status={invoice.paymentStatus} />
            </div>
          </div>
          <div className="text-left text-sm text-slate-600 md:text-right">
            <p className="font-bold text-slate-900">Aurum Advisory</p>
            <p className="mt-1">123 Corporate Avenue, Tech Park</p>
            <p>billing@aurum.advisory</p>
            <p>GSTIN: 27AABCT1234D1Z5</p>
          </div>
        </div>

        {/* Client Info block */}
        <div className="mt-10 flex flex-col justify-between gap-8 md:flex-row">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Billed To</p>
            <div className="mt-3 text-sm text-slate-900">
              <p className="font-bold">{client?.companyName ?? "Unknown Client"}</p>
              <p className="mt-1 text-slate-600">{client?.name}</p>
              <p className="text-slate-600">{client?.email}</p>
            </div>
          </div>
          <div className="text-sm">
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-slate-600 md:text-right">
              <span className="font-medium text-slate-500">Invoice Date:</span>
              <span className="text-slate-900">{formatDateTime(invoice.issueDate)}</span>
              <span className="font-medium text-slate-500">Due Date:</span>
              <span className="text-slate-900">{formatDateTime(invoice.dueDate)}</span>
              {invoice.paymentStatus === "paid" && invoice.paidAt && (
                <>
                  <span className="font-medium text-slate-500">Paid On:</span>
                  <span className="text-slate-900">{formatDateTime(invoice.paidAt)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="mt-16 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="pb-3 font-bold uppercase tracking-widest text-xs">Description</th>
                <th className="pb-3 text-right font-bold uppercase tracking-widest text-xs">Rate</th>
                <th className="pb-3 text-right font-bold uppercase tracking-widest text-xs">Qty</th>
                <th className="pb-3 text-right font-bold uppercase tracking-widest text-xs">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.lineItems.map((item, index) => (
                <tr key={`${item.id}-${index}`}>
                  <td className="py-5 pr-4 max-w-sm">
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-slate-500 leading-relaxed">{item.description}</p>
                  </td>
                  <td className="py-5 text-right text-slate-600 align-top">{formatCurrency(item.unitPrice)}</td>
                  <td className="py-5 text-right text-slate-600 align-top">{item.quantity}</td>
                  <td className="py-5 text-right font-bold text-slate-900 align-top">{formatCurrency(item.amount)}</td>
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
              <span>GST ({invoice.taxPercent}%)</span>
              <span>{formatCurrency(invoice.taxAmount)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-slate-900">
              <span>Total Due</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
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
            <p>Account Name: Aurum Advisory Services</p>
            <p>Account No: 10002930491823</p>
            <p>IFSC: RTB000100</p>
          </div>
        </div>
      </article>
    </AppShell>
  );
}
