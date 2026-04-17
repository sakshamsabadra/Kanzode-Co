import dbConnect from "./dbConnect";
import Client from "../models/Client";
import Quotation from "../models/Quotation";
import Invoice from "../models/Invoice";
import Party from "../models/Party";
import ServiceCatalogItem from "../models/ServiceCatalogItem";
import Task from "../models/Task";
import ActivityLog from "../models/ActivityLog";
import SuggestedPackage from "../models/SuggestedPackage";
import ClientInteraction from "../models/ClientInteraction";
import {
  ActivityType,
  InvoicePaymentStatus,
  QuotationStatus,
  TaskStatus
} from "@/types";

// Helper for activity logs
async function appendActivity(
  clientId: string,
  entityType: "quotation" | "invoice",
  entityId: string,
  action: ActivityType,
  message: string
) {
  await ActivityLog.create({
    clientId,
    entityType,
    entityId,
    action,
    message
  });
}

// ── Clients ──────────────────────────────────────────────────────────
export async function getClients() {
  await dbConnect();
  return Client.find({}).sort({ createdAt: -1 }).lean();
}

export async function getClientById(clientId: string) {
  await dbConnect();
  return Client.findById(clientId).lean();
}

export async function createClient(data: any) {
  await dbConnect();
  return Client.create(data);
}

export async function updateClient(clientId: string, data: any) {
  await dbConnect();
  return Client.findByIdAndUpdate(clientId, data, { new: true }).lean();
}

export async function deleteClient(clientId: string) {
  await dbConnect();
  return Client.findByIdAndDelete(clientId);
}

// ── Quotations ───────────────────────────────────────────────────────
export async function getQuotations() {
  await dbConnect();
  return Quotation.find({}).sort({ createdAt: -1 }).lean();
}

export async function getQuotationById(quotationId: string) {
  await dbConnect();
  return Quotation.findById(quotationId).lean();
}

export async function createQuotation(data: any) {
  await dbConnect();

  // Generate numbers
  const count = await Quotation.countDocuments();
  const qNumber = `QT-2026-${String(count + 1001)}`;
  const challanNumber = `CH-2026-${String(count + (await Invoice.countDocuments()) + 1001)}`;

  const quotation = await Quotation.create({
    ...data,
    quotationNumber: qNumber,
    challanNumber: challanNumber,
  });

  await appendActivity(
    quotation.clientId.toString(),
    "quotation",
    quotation._id.toString(),
    "generated",
    `${quotation.quotationNumber} generated from source request text.`
  );

  return quotation;
}

export async function updateQuotationStatus(quotationId: string, status: QuotationStatus) {
  await dbConnect();
  const quotation = await Quotation.findById(quotationId);
  if (!quotation) throw new Error("Quotation not found");

  quotation.status = status;
  if (status === "sent") quotation.sentAt = new Date();
  if (status === "opened") quotation.openedAt = new Date();
  if (status === "approved") quotation.approvedAt = new Date();

  await quotation.save();

  const actionMap: Record<QuotationStatus, ActivityType> = {
    draft: "generated",
    generated: "generated",
    sent: "sent_portal",
    opened: "opened",
    approved: "approved"
  };

  await appendActivity(
    quotation.clientId.toString(),
    "quotation",
    quotation._id.toString(),
    actionMap[status],
    `${quotation.quotationNumber} marked as ${status}.`
  );

  return quotation;
}

export async function updateQuotationLineItems(quotationId: string, lineItems: any[]) {
  await dbConnect();
  const quotation = await Quotation.findById(quotationId);
  if (!quotation) throw new Error("Quotation not found");

  quotation.lineItems = lineItems;
  quotation.subtotal = lineItems.reduce((sum: number, item: any) => sum + item.amount, 0);
  quotation.taxAmount = Math.round((quotation.subtotal * quotation.taxPercent) / 100);
  quotation.total = quotation.subtotal + quotation.taxAmount;

  await quotation.save();
  return quotation;
}

// ── Invoices ──────────────────────────────────────────────────────────
export async function getInvoices() {
  await dbConnect();
  return Invoice.find({}).sort({ createdAt: -1 }).lean();
}

export async function getInvoiceById(invoiceId: string) {
  await dbConnect();
  return Invoice.findById(invoiceId).lean();
}

export async function createInvoiceFromQuotation(quotationId: string) {
  await dbConnect();
  const quotation = await Quotation.findById(quotationId);
  if (!quotation) throw new Error("Quotation not found");

  const count = await Invoice.countDocuments();
  const iNumber = `INV-2026-${String(count + 1001)}`;

  const issueDate = new Date();
  const dueDate = new Date(issueDate);
  dueDate.setMonth(dueDate.getMonth() + 1);
  dueDate.setDate(10);

  const invoice = await Invoice.create({
    quotationId: quotation._id,
    challanNumber: quotation.challanNumber,
    clientId: quotation.clientId,
    partyId: quotation.partyId,
    invoiceNumber: iNumber,
    issueDate,
    dueDate,
    lineItems: quotation.lineItems,
    subtotal: quotation.subtotal,
    taxPercent: quotation.taxPercent,
    taxAmount: quotation.taxAmount,
    total: quotation.total,
    paidAmount: 0,
    paymentStatus: "unpaid"
  });

  await appendActivity(
    invoice.clientId.toString(),
    "invoice",
    invoice._id.toString(),
    "converted",
    `${invoice.invoiceNumber} created from ${quotation.quotationNumber}.`
  );

  return invoice;
}

export async function createInvoiceManual(data: any) {
  await dbConnect();
  const count = await Invoice.countDocuments();
  const iNumber = `INV-2026-${String(count + 1001)}`;
  const challanCount = await Quotation.countDocuments();
  const challanNumber = `CH-2026-${String(challanCount + count + 1001)}`;

  const issueDate = new Date(data.issueDate);
  const dueDate = new Date(issueDate);
  dueDate.setMonth(dueDate.getMonth() + 1);
  dueDate.setDate(10);

  const invoice = await Invoice.create({
    ...data,
    invoiceNumber: iNumber,
    challanNumber,
    issueDate,
    dueDate,
    paidAmount: data.paidAmount ?? 0
  });

  await appendActivity(
    invoice.clientId.toString(),
    "invoice",
    invoice._id.toString(),
    "converted",
    `${invoice.invoiceNumber} created manually.`
  );

  return invoice;
}

export async function updateInvoiceStatus(invoiceId: string, paymentStatus: InvoicePaymentStatus) {
  await dbConnect();
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new Error("Invoice not found");

  invoice.paymentStatus = paymentStatus;
  if (paymentStatus === "paid") {
    invoice.paidAt = new Date();
    invoice.paidAmount = invoice.total;
  }

  await invoice.save();

  const actionMap: Record<InvoicePaymentStatus, ActivityType> = {
    unpaid: "converted",
    paid: "paid",
    overdue: "overdue"
  };

  await appendActivity(
    invoice.clientId.toString(),
    "invoice",
    invoice._id.toString(),
    actionMap[paymentStatus],
    `${invoice.invoiceNumber} updated to ${paymentStatus}.`
  );

  return invoice;
}

export async function updateInvoiceLineItems(invoiceId: string, lineItems: any[]) {
  await dbConnect();
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) throw new Error("Invoice not found");

  invoice.lineItems = lineItems;
  invoice.subtotal = lineItems.reduce((sum: number, item: any) => sum + item.amount, 0);
  invoice.taxAmount = Math.round((invoice.subtotal * invoice.taxPercent) / 100);
  invoice.total = invoice.subtotal + invoice.taxAmount;

  await invoice.save();
  return invoice;
}

// ── Parties ───────────────────────────────────────────────────────────
export async function getParties() {
  await dbConnect();
  return Party.find({}).sort({ createdAt: -1 }).lean();
}

export async function getPartyById(partyId: string) {
  await dbConnect();
  return Party.findById(partyId).lean();
}

export async function createParty(data: any) {
  await dbConnect();
  return Party.create(data);
}

export async function updateParty(partyId: string, data: any) {
  await dbConnect();
  return Party.findByIdAndUpdate(partyId, data, { new: true }).lean();
}

export async function deleteParty(partyId: string) {
  await dbConnect();
  return Party.findByIdAndDelete(partyId);
}

// ── Tasks ─────────────────────────────────────────────────────────────
export async function getTasks() {
  await dbConnect();
  return Task.find({}).sort({ createdAt: -1 }).lean();
}

export async function createTask(data: any) {
  await dbConnect();
  return Task.create(data);
}

export async function updateTask(taskId: string, data: any) {
  await dbConnect();
  return Task.findByIdAndUpdate(taskId, data, { new: true });
}

export async function deleteTask(taskId: string) {
  await dbConnect();
  return Task.findByIdAndDelete(taskId);
}

// ── Service Catalog ────────────────────────────────────────────────────
export async function getServiceCatalog() {
  await dbConnect();
  return ServiceCatalogItem.find({}).lean();
}

export async function addServiceCatalogItem(data: any) {
  await dbConnect();
  return ServiceCatalogItem.create(data);
}

export async function updateServiceCatalogItem(itemId: string, data: any) {
  await dbConnect();
  return ServiceCatalogItem.findByIdAndUpdate(itemId, data, { new: true });
}

export async function deleteServiceCatalogItem(itemId: string) {
  await dbConnect();
  return ServiceCatalogItem.findByIdAndDelete(itemId);
}

// ── Activity Logs ─────────────────────────────────────────────────────
export async function getActivityLogs() {
  await dbConnect();
  return ActivityLog.find({}).sort({ createdAt: -1 }).limit(20).lean();
}

// ── Suggested Packages ────────────────────────────────────────────────
export async function getSuggestedPackages() {
  await dbConnect();
  return SuggestedPackage.find({}).lean();
}

// ── Client Interactions ───────────────────────────────────────────────
export async function getClientInteractions(clientId: string) {
  await dbConnect();
  return ClientInteraction.find({ clientId }).sort({ createdAt: -1 }).lean();
}

export async function createClientInteraction(data: any) {
  await dbConnect();
  return ClientInteraction.create(data);
}

// ── Client History ─────────────────────────────────────────────────────
export async function getClientHistory(clientId: string) {
  await dbConnect();
  const client = await Client.findById(clientId);
  const quotations = await Quotation.find({ clientId });
  const invoices = await Invoice.find({ clientId });
  const activityLogs = await ActivityLog.find({ clientId }).sort({ createdAt: -1 });
  const interactions = await ClientInteraction.find({ clientId }).sort({ createdAt: -1 });

  return {
    client,
    quotations,
    invoices,
    activityLogs,
    interactions,
    pastServices: client?.pastServices ?? []
  };
}
