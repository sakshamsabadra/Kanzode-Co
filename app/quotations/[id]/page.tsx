export const dynamic = "force-dynamic";

import "@/app/print-styles.css";
import { notFound } from "next/navigation";
import { convertSavedQuotationToInvoice, sendSavedQuotation, updateQuotationAction } from "@/app/actions";
import { EditChallanForm } from "@/components/quotations/edit-challan-form";
import { AppShell } from "@/components/layout/app-shell";
import { ConvertQuotationButton, DeliverPortalButton, ShareButton, PrintButton } from "@/components/ui/client-actions";
import * as dataService from "@/lib/data-service";
import { formatCurrency, formatDateTime } from "@/lib/format";
// Removed numberToWords import

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

  // Removed amountInWords - using Quotation Amount instead

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
          <EditChallanForm 
            quotationId={id} 
            currentChallanNumber={quotation.challanNumber} 
            currentChallanAmount={quotation.challanAmount}
            onUpdate={updateQuotationAction}
          />
          <ConvertQuotationButton quotationId={id} />
          <DeliverPortalButton quotationId={id} />
          <ShareButton />
          <PrintButton />
        </div>
      }
    >
      <article
        className="print-document mx-auto w-full max-w-4xl bg-white flex flex-col"
        style={{ 
          fontFamily: "'Times New Roman', serif", 
          color: "#111", 
          fontSize: "14px",
          minHeight: "277mm" // A4 height minus 20mm margins
        }}
      >
        {/* Content wrapper */}
        <div className="flex flex-col">
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
          </div>
        </div>

          {/* ══════════════════════════════════════════
              ENHANCED INTENT / DESCRIPTION
          ══════════════════════════════════════════ */}
          {quotation.sourceText && (
            <div style={{ 
              marginBottom: "24px", 
              padding: "16px", 
              background: "#f8fafc", 
              borderRadius: "12px",
              borderLeft: "4px solid #3b82f6",
              fontSize: "13.5px",
              lineHeight: "1.7",
              color: "#334155",
              fontFamily: "Arial, sans-serif"
            }}>
              <p style={{ fontWeight: "bold", fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", marginBottom: "8px" }}>
                Project Overview / Scope
              </p>
              {quotation.sourceText}
            </div>
          )}

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

        {/* SPACER to push footer to bottom */}
        <div style={{ flexGrow: 1 }} />

        {/* BOTTOM SECTION - Always at bottom of last page */}
        <div 
          style={{ 
            flexShrink: 0, 
            breakInside: "avoid",
            pageBreakBefore: quotation.lineItems.length > 7 ? "always" : "auto"
          }}
        >
          <div className="px-[10%]">
          
          {/* ══════════════════════════════════════════
              COMMERCIAL SUMMARY & QR SECTION
          ══════════════════════════════════════════ */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "40px",
              alignItems: "end",
              marginBottom: "40px",
              paddingTop: "20px",
              borderTop: "2px solid #60a5fa"
            }}
          >
            {/* Left - QR and Terms */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ 
                  border: "1px solid #e2e8f0", 
                  padding: "4px", 
                  borderRadius: "8px", 
                  background: "#f8fafc" 
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src="/payment-qr.png" 
                    alt="Payment QR Code" 
                    style={{ width: "90px", height: "90px", objectFit: "contain" }}
                  />
                </div>
                <div>
                  <p style={{ fontWeight: "bold", fontSize: "14px", color: "#1e40af", marginBottom: "4px" }}>Scan to Pay</p>
                  <p style={{ fontSize: "11px", color: "#64748b", lineHeight: "1.4" }}>
                    Payments accepted via all<br/>major UPI apps and banks.
                  </p>
                </div>
              </div>

              {/* Terms inline */}
              <div style={{ fontSize: "11px", color: "#444", lineHeight: "1.5" }}>
                <p style={{ fontWeight: "bold", textTransform: "uppercase", letterSpacing: "0.05em", color: "#64748b", fontSize: "10px", marginBottom: "4px" }}>Terms & Conditions</p>
                {quotation.terms?.length > 0 ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {quotation.terms.map((term: string, i: number) => (
                      <span key={i} style={{ background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px" }}>
                        {term}
                      </span>
                    ))}
                  </div>
                ) : (
                  "Accepted as per mutual discussion."
                )}
              </div>
            </div>

            {/* Right - Totals */}
            <div style={{ fontSize: "14px", fontFamily: "Arial, sans-serif" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", color: "#64748b" }}>
                <span>Sub Total</span>
                <span>{formatCurrency(quotation.subtotal ?? quotation.total)}</span>
              </div>
              
              {quotation.challanNumber && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px dashed #e2e8f0" }}>
                  <span style={{ color: "#64748b" }}>Challan {quotation.challanNumber}</span>
                  <span style={{ fontWeight: "600" }}>{formatCurrency(quotation.challanAmount ?? 0)}</span>
                </div>
              )}

              <div style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                marginTop: "12px",
                padding: "16px 20px", 
                background: "#1e40af", 
                color: "white",
                borderRadius: "12px",
                fontWeight: "bold", 
                fontSize: "18px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
              }}>
                <span>Total</span>
                <span>{formatCurrency((quotation.total) + (quotation.challanAmount ?? 0))}</span>
              </div>
            </div>
          </div>

          </div>

          {/* ══════════════════════════════════════════
              BANK DETAILS & SIGNATORY
          ══════════════════════════════════════════ */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/template-footer.png" alt="Bank Details and Signatory Footer" className="w-full h-auto" />
        </div>
      </article>
    </AppShell>
  );
}
