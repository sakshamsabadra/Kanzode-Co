"use server";

import * as dataService from "@/lib/data-service";
import { MockQuotationDraft } from "@/lib/quotation-generator";
import { revalidatePath } from "next/cache";
import { analyzeRequestWithAI } from "@/lib/ai-service";

export async function analyzeRequestAction(sourceText: string, clientId: string) {
  const client = await dataService.getClientById(clientId);
  const serviceCatalog = await dataService.getServiceCatalog();
  const suggestedPackages = await dataService.getSuggestedPackages();

  if (!client) throw new Error("Client not found");

  return await analyzeRequestWithAI(
    sourceText,
    JSON.parse(JSON.stringify(client)),
    JSON.parse(JSON.stringify(serviceCatalog)),
    JSON.parse(JSON.stringify(suggestedPackages))
  );
}

export async function saveQuotationDraft(draft: MockQuotationDraft, clientId: string, sourceText: string, partyId?: string) {
  const quotation = await dataService.createQuotation({
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

  revalidatePath("/dashboard");
  revalidatePath("/quotations");
  
  return quotation._id.toString();
}

export async function convertSavedQuotationToInvoice(quotationId: string) {
  const invoice = await dataService.createInvoiceFromQuotation(quotationId);
  revalidatePath("/dashboard");
  revalidatePath("/invoices");
  return invoice._id.toString();
}

export async function sendSavedQuotation(quotationId: string) {
  await dataService.updateQuotationStatus(quotationId, "sent");
  revalidatePath(`/quotations/${quotationId}`);
}

export async function deleteQuotationAction(id: string) {
  await dataService.deleteQuotation(id);
  revalidatePath("/quotations");
  revalidatePath("/dashboard");
}

export async function deleteInvoiceAction(id: string) {
  await dataService.deleteInvoice(id);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
}

export async function updateQuotationAction(id: string, data: any) {
  await dataService.updateQuotation(id, data);
  revalidatePath(`/quotations/${id}`);
  revalidatePath("/quotations");
  revalidatePath("/dashboard");
}

export async function createPartyAction(data: any) {
  await dataService.createParty(data);
  revalidatePath("/clients");
}

export async function deletePartyAction(id: string) {
  await dataService.deleteParty(id);
  revalidatePath("/clients");
}

export async function createTaskAction(data: any) {
  await dataService.createTask(data);
  revalidatePath("/tasks");
}

export async function updateTaskAction(id: string, data: any) {
  await dataService.updateTask(id, data);
  revalidatePath("/tasks");
}

export async function deleteTaskAction(id: string) {
  await dataService.deleteTask(id);
  revalidatePath("/tasks");
}

export async function addServiceAction(data: any) {
  await dataService.addServiceCatalogItem(data);
  revalidatePath("/services");
}

export async function updateServiceAction(id: string, data: any) {
  await dataService.updateServiceCatalogItem(id, data);
  revalidatePath("/services");
}

export async function deleteServiceAction(id: string) {
  await dataService.deleteServiceCatalogItem(id);
  revalidatePath("/services");
}

export async function markInvoicePaidAction(id: string) {
  await dataService.updateInvoiceStatus(id, "paid");
  revalidatePath(`/invoices/${id}`);
  revalidatePath("/dashboard");
}

export async function updateInvoiceAction(id: string, data: any) {
  await dataService.updateInvoice(id, data);
  revalidatePath(`/invoices/${id}`);
  revalidatePath("/invoices");
  revalidatePath("/dashboard");
}

export async function createClientAction(data: any) {
  await dataService.createClient(data);
  revalidatePath("/clients");
  revalidatePath("/dashboard");
}

export async function updateClientAction(id: string, data: any) {
  await dataService.updateClient(id, data);
  revalidatePath("/clients");
}

export async function deleteClientAction(id: string) {
  await dataService.deleteClient(id);
  revalidatePath("/clients");
  revalidatePath("/dashboard");
}

export async function updatePartyAction(id: string, data: any) {
  await dataService.updateParty(id, data);
  revalidatePath("/clients");
}
