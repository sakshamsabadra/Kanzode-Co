"use server";

import { createQuotation, createInvoiceFromQuotation, updateQuotationStatus } from "@/lib/mock-storage";
import { MockQuotationDraft } from "@/lib/mock-quotation-generator";

export async function saveQuotationDraft(draft: MockQuotationDraft, clientId: string, sourceText: string, partyId?: string) {
  const quotation = createQuotation({
    clientId,
    partyId,
    quotationType: draft.quotationType,
    sourceText,
    extractedIntent: `Auto-generated proposal - ${draft.urgency}`,
    lineItems: draft.lineItems,
    subtotal: draft.subtotal,
    taxPercent: draft.taxPercent,
    taxAmount: draft.taxAmount,
    total: draft.total,
    status: "draft",
    validityDays: draft.urgency === "Urgent" ? 3 : 7,
    terms: draft.terms,
    notes: draft.notes
  });

  return quotation.id;
}

export async function convertSavedQuotationToInvoice(quotationId: string) {
  const invoice = createInvoiceFromQuotation(quotationId);
  return invoice.id;
}

export async function sendSavedQuotation(quotationId: string) {
  updateQuotationStatus(quotationId, "sent");
  return true;
}
