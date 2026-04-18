export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { convertSavedQuotationToInvoice, sendSavedQuotation } from "@/app/actions";
import { AppShell } from "@/components/layout/app-shell";
import { ConvertQuotationButton, DeliverPortalButton, ShareButton, PrintButton } from "@/components/ui/client-actions";
import * as dataService from "@/lib/data-service";
import { formatCurrency, formatDateTime } from "@/lib/format";
import { numberToWords } from "@/lib/numberToWords";

export default async function QuotationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const quotation: any = await dataService.getQuotationById(id);

  if (!quotation) {
    notFound();
  }

  const client: any = await dataService.getClientById(quotation.clientId.toString());
  const party: any = quotation.partyId
    ? await dataService.getPartyById(quotation.partyId.toString())
    : null;

  const amountInWords = numberToWords(quotation.total);

  const billToName = party ? party.name : client?.companyName ?? "Unknown Client";
  const billToAddress = party ? party.address : client?.address ?? "";

  // Validity expiry date
  const issuedDate = new Date(quotation.createdAt);
  const validUntil = new Date(issuedDate);
  validUntil.setDate(validUntil.getDate() + (quotation.validityDays ?? 7));

  return (
    <AppShell
      title={quotation.quotationNumber}
      description="Quotation"
      actions={
        <div className="flex gap-3 no-print">
          <ConvertQuotationButton quotationId={id} />
          <DeliverPortalButton quotationId={id} />
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
              Quotation
            </span>
          </div>

          {/* ══════════════════════════════════════════
              PREPARED FOR  +  QUOTATION DETAILS
          ══════════════════════════════════════════ */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: "20px",
            }}
          >
            {/* Prepared For */}
            <div style={{ flex: 1, paddingRight: "24px" }}>
              <p style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "8px" }}>
                Prepared For
              </p>
              <p style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "4px" }}>{billToName}</p>
              <p style={{ fontSize: "13px", color: "#333", lineHeight: "1.6" }}>
                {billToAddress}
              </p>
            </div>

            {/* Quotation Details */}
            <div style={{ textAlign: "right", fontSize: "13px", flexShrink: 0 }}>
              <p style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "8px" }}>
                Quotation Details
              </p>
              <p style={{ marginBottom: "6px" }}>Quotation No. : {quotation.quotationNumber}</p>
              <p style={{ marginBottom: "6px" }}>Date : {formatDateTime(quotation.createdAt)}</p>
              <p style={{ marginBottom: "6px" }}>Valid Until : {formatDateTime(validUntil.toISOString())}</p>
              {quotation.challanNumber && (
                <p style={{ marginBottom: "6px" }}>
                  Challan : {quotation.challanNumber}
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
              {quotation.lineItems.map((item: any, index: number) => (
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
          {/* Notes */}
          {quotation.notes && (
            <div style={{ paddingBottom: "16px", fontSize: "14px", fontFamily: "Arial, sans-serif" }}>
              <strong>Notes:</strong> {quotation.notes}
            </div>
          )}

          {/* ══════════════════════════════════════════
              FOOTER SECTION:
              Left – Words + T&C
              Right – Totals
          ══════════════════════════════════════════ */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: "32px",
            }}
          >
            {/* Left */}
            <div style={{ flex: 1, paddingRight: "32px", fontSize: "14px", fontFamily: "Arial, sans-serif" }}>
              <p style={{ marginBottom: "16px" }}>
                <strong>Quotation Amount in Words:</strong> {amountInWords}
              </p>
              <p>
                <strong>Terms and Conditions:</strong>{" "}
                {quotation.terms?.length > 0 ? (
                  <span style={{ display: "inline-block", marginTop: "4px" }}>
                    {quotation.terms.join(" | ")}
                  </span>
                ) : (
                  "Accepted as per mutual discussion."
                )}
              </p>
            </div>

            {/* Right */}
            <div style={{ minWidth: "260px", fontSize: "14px", fontFamily: "Arial, sans-serif" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111", padding: "6px 0" }}>
                <span>Sub Total</span>
                <span>{formatCurrency(quotation.subtotal ?? quotation.total)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #111", padding: "6px 0", fontWeight: "bold" }}>
                <span>Total</span>
                <span>{formatCurrency(quotation.total)}</span>
              </div>
            </div>
          </div>

          </div>

          {/* ══════════════════════════════════════════
              BANK DETAILS & SIGNATORY (Image provided by user)
          ══════════════════════════════════════════ */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/template-footer.png" alt="Bank Details and Signatory Footer" className="w-full h-auto mt-4" />
        </div>
      </article>
    </AppShell>
  );
}
