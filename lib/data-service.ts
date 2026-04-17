import dbConnect from "./dbConnect";
import Client from "../models/Client";
import Quotation from "../models/Quotation";
import Invoice from "../models/Invoice";
import Party from "../models/Party";
import ServiceCatalogItem from "../models/ServiceCatalogItem";
import Task from "../models/Task";
import ActivityLog from "../models/ActivityLog";
import SuggestedPackage from "../models/SuggestedPackage";
import * as mock from "./mock-storage";
import {
  ActivityType,
  InvoicePaymentStatus,
  QuotationStatus,
  QuotationType,
  TaskStatus
} from "@/types";

const useMock = process.env.USE_MOCK_DATA === "true";

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

// Clients
export async function getClients() {
  if (useMock) return mock.getClients();
  await dbConnect();
  return Client.find({}).sort({ createdAt: -1 }).lean();
}

export async function getClientById(clientId: string) {
  if (useMock) return mock.getClientById(clientId);
  await dbConnect();
  return Client.findById(clientId).lean();
}

// Quotations
export async function getQuotations() {
  if (useMock) return mock.getQuotations();
  await dbConnect();
  return Quotation.find({}).sort({ createdAt: -1 }).lean();
}

export async function getQuotationById(quotationId: string) {
  if (useMock) return mock.getQuotationById(quotationId);
  await dbConnect();
  return Quotation.findById(quotationId).lean();
}

export async function createQuotation(data: any) {
  if (useMock) return mock.createQuotation(data);
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
  if (useMock) return mock.updateQuotationStatus(quotationId, status);
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

// Invoices
export async function getInvoices() {
  if (useMock) return mock.getInvoices();
  await dbConnect();
  return Invoice.find({}).sort({ createdAt: -1 }).lean();
}

export async function getInvoiceById(invoiceId: string) {
  if (useMock) return mock.getInvoiceById(invoiceId);
  await dbConnect();
  return Invoice.findById(invoiceId).lean();
}

export async function createInvoiceFromQuotation(quotationId: string) {
  if (useMock) return mock.createInvoiceFromQuotation(quotationId);
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

export async function updateInvoiceStatus(invoiceId: string, paymentStatus: InvoicePaymentStatus) {
  if (useMock) return mock.updateInvoiceStatus(invoiceId, paymentStatus);
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

// Parties
export async function getParties() {
  if (useMock) return mock.getParties();
  await dbConnect();
  return Party.find({}).sort({ createdAt: -1 }).lean();
}

export async function getPartyById(partyId: string) {
  if (useMock) return mock.getPartyById(partyId);
  await dbConnect();
  return Party.findById(partyId).lean();
}

export async function createParty(data: any) {
  if (useMock) return mock.createParty(data);
  await dbConnect();
  return Party.create(data);
}

export async function deleteParty(partyId: string) {
  if (useMock) {
    mock.deleteParty(partyId);
    return true;
  }
  await dbConnect();
  return Party.findByIdAndDelete(partyId);
}

// Tasks
export async function getTasks() {
  if (useMock) return mock.getTasks();
  await dbConnect();
  return Task.find({}).sort({ createdAt: -1 }).lean();
}

export async function createTask(data: any) {
  if (useMock) return mock.createTask(data);
  await dbConnect();
  return Task.create(data);
}

export async function updateTask(taskId: string, data: any) {
  if (useMock) return mock.updateTask(taskId, data);
  await dbConnect();
  return Task.findByIdAndUpdate(taskId, data, { new: true });
}

export async function deleteTask(taskId: string) {
  if (useMock) {
    mock.deleteTask(taskId);
    return true;
  }
  await dbConnect();
  return Task.findByIdAndDelete(taskId);
}

// Service Catalog
export async function getServiceCatalog() {
  if (useMock) return mock.getServiceCatalog();
  await dbConnect();
  return ServiceCatalogItem.find({}).lean();
}

export async function addServiceCatalogItem(data: any) {
  if (useMock) return mock.addServiceCatalogItem(data);
  await dbConnect();
  return ServiceCatalogItem.create(data);
}

export async function updateServiceCatalogItem(itemId: string, data: any) {
  if (useMock) return mock.updateServiceCatalogItem(itemId, data);
  await dbConnect();
  return ServiceCatalogItem.findByIdAndUpdate(itemId, data, { new: true });
}

export async function deleteServiceCatalogItem(itemId: string) {
  if (useMock) {
    mock.deleteServiceCatalogItem(itemId);
    return true;
  }
  await dbConnect();
  return ServiceCatalogItem.findByIdAndDelete(itemId);
}

// Activity Logs
export async function getActivityLogs() {
  if (useMock) return mock.getActivityLogs();
  await dbConnect();
  return ActivityLog.find({}).sort({ createdAt: -1 }).limit(20).lean();
}

// Suggested Packages
export async function getSuggestedPackages() {
  if (useMock) return mock.getSuggestedPackages();
  await dbConnect();
  return SuggestedPackage.find({}).lean();
}

// Client History
export async function getClientHistory(clientId: string) {
  if (useMock) return mock.getClientHistory(clientId);
  await dbConnect();
  const client = await Client.findById(clientId);
  const quotations = await Quotation.find({ clientId });
  const invoices = await Invoice.find({ clientId });
  const activityLogs = await ActivityLog.find({ clientId }).sort({ createdAt: -1 });

  return {
    client,
    quotations,
    invoices,
    activityLogs,
    pastServices: client?.pastServices ?? []
  };
}
