export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { ShareButton, PrintButton, RecordPaymentButton } from "@/components/ui/client-actions";
import * as dataService from "@/lib/data-service";
import { markInvoicePaidAction } from "@/app/actions";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { numberToWords } from "@/lib/numberToWords";
import Image from "next/image";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const invoice: any = await dataService.getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  const client: any = await dataService.getClientById(invoice.clientId.toString());
  const quotation: any = invoice.quotationId
    ? await dataService.getQuotationById(invoice.quotationId.toString())
    : null;
  const party: any = invoice.partyId
    ? await dataService.getPartyById(invoice.partyId.toString())
    : null;

  const balance = invoice.total - (invoice.paidAmount ?? 0);
  const amountInWords = numberToWords(invoice.total);

  const billToName = party ? party.name : client?.companyName ?? "Unknown Client";
  const billToAddress = party ? party.address : client?.address ?? "";

  return (
    <AppShell
      title={invoice.invoiceNumber}
      description="Invoice"
      actions={
        <div className="flex gap-3 no-print">
          <RecordPaymentButton invoiceId={id} disabled={invoice.paymentStatus === "paid"} />
          <ShareButton />
          <PrintButton />
        </div>
      }
    >
      <article
        className="print-document mx-auto w-full max-w-3xl bg-white flex flex-col justify-between min-h-[1050px] print:min-h-0"
        style={{ fontFamily: "'Times New Roman', serif", color: "#111", fontSize: "14px", overflow: "hidden" }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* ══════════════════════════════════════════
              HEADER  –  Letterhead + Logo (Image provided by user)
          ══════════════════════════════════════════ */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/template-header.png" alt="Kanzode & Co. Header" className="w-full h-auto mb-8" />

          <div className="px-[10%] flex-1 flex flex-col">

          {/* ══════════════════════════════════════════
              TITLE
          ══════════════════════════════════════════ */}
          <div style={{ textAlign: "center", padding: "4px 0 16px", fontFamily: "Arial, sans-serif" }}>
            <span
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#3b82f6",
                letterSpacing: "0.5px",
              }}
            >
              Tax Invoice
            </span>
          </div>

          {/* ══════════════════════════════════════════
              BILL TO  +  INVOICE DETAILS
          ══════════════════════════════════════════ */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "20px",
            }}
          >
            {/* Bill To */}
            <div style={{ flex: 1, paddingRight: "24px" }}>
              <p style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "8px" }}>
                Bill To
              </p>
              <p style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "4px" }}>{billToName}</p>
              <p style={{ fontSize: "13px", color: "#333", lineHeight: "1.6" }}>
                {billToAddress}
              </p>
            </div>

            {/* Invoice Details */}
            <div style={{ textAlign: "right", fontSize: "13px", flexShrink: 0 }}>
              <p style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "8px" }}>
                Invoice Details
              </p>
              <p style={{ marginBottom: "6px" }}>Invoice No. : {invoice.invoiceNumber}</p>
              <p style={{ marginBottom: "6px" }}>Date : {formatDateTime(invoice.issueDate)}</p>
              {quotation && (
                <p style={{ marginBottom: "6px" }}>
                  Ref : {quotation.quotationNumber}
                </p>
              )}
              {invoice.challanNumber && (
                <p style={{ marginBottom: "6px" }}>
                  Challan : {invoice.challanNumber}
                </p>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════
              LINE ITEMS TABLE
          ══════════════════════════════════════════ */}
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13px",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#60a5fa",
                  color: "white",
                }}
              >
                <th
                  style={{
                    padding: "8px 10px",
                    textAlign: "left",
                    fontWeight: "bold",
                    width: "48px",
                  }}
                >
                  #
                </th>
                <th style={{ padding: "8px 10px", textAlign: "left", fontWeight: "bold" }}>
                  Item name
                </th>
                <th
                  style={{
                    padding: "8px 10px",
                    textAlign: "right",
                    fontWeight: "bold",
                    width: "140px",
                  }}
                >
                  Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.lineItems.map((item: any, index: number) => (
                <tr
                  key={`${item.id}-${index}`}
                  style={{
                    borderBottom: "1px solid #111",
                  }}
                >
                  <td style={{ padding: "10px 10px" }}>{index + 1}</td>
                  <td style={{ padding: "10px 10px", fontWeight: "bold" }}>{item.title}</td>
                  <td style={{ padding: "10px 10px", textAlign: "right" }}>
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div style={{ flexShrink: 0 }}>
          <div className="px-[10%]">
          {/* ══════════════════════════════════════════
              FOOTER SECTION:
              Left – Amount in words + T&C
              Right – Totals summary
          ══════════════════════════════════════════ */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "32px",
            }}
          >
            {/* Left – words + terms */}
            <div style={{ flex: 1, paddingRight: "32px", fontSize: "14px", fontFamily: "Arial, sans-serif" }}>
              <p style={{ marginBottom: "16px" }}>
                <strong>Invoice Amount in Words:</strong> {amountInWords}
              </p>
              <p>
                <strong>Terms and Conditions</strong> Thanks for doing business with us!
              </p>
            </div>

            {/* Right – totals */}
            <div style={{ minWidth: "260px", fontSize: "14px", fontFamily: "Arial, sans-serif" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111", padding: "6px 0" }}>
                <span>Sub Total</span>
                <span>{formatCurrency(invoice.subtotal ?? invoice.total)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111", padding: "6px 0", fontWeight: "bold" }}>
                <span>Total</span>
                <span>{formatCurrency(invoice.total)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111", padding: "6px 0" }}>
                <span>Received</span>
                <span>{formatCurrency(invoice.paidAmount ?? 0)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111", padding: "6px 0" }}>
                <span>Balance</span>
                <span>{formatCurrency(balance)}</span>
              </div>
            </div>
          </div>

          </div>

          {/* ══════════════════════════════════════════
              BANK DETAILS  +  AUTHORIZED SIGNATORY (Image provided by user)
          ══════════════════════════════════════════ */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/template-footer.png" alt="Bank Details and Signatory Footer" className="w-full h-auto mt-4" />
        </div>
      </article>
    </AppShell>
  );
}
