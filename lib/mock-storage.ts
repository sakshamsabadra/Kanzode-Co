import {
  initialActivityLogs,
  initialClientInteractions,
  initialClients,
  initialInvoices,
  initialQuotations,
  initialServiceCatalog,
  initialSuggestedPackages
} from "@/data/mock-data";
import {
  ActivityLog,
  Client,
  ClientInteraction,
  Invoice,
  InvoicePaymentStatus,
  Quotation,
  QuotationStatus,
  SuggestedPackage
} from "@/types";

type CreateQuotationInput = Omit<
  Quotation,
  "id" | "quotationNumber" | "createdAt" | "sentAt" | "openedAt" | "approvedAt"
>;

type MockStore = {
  clients: Client[];
  serviceCatalog: typeof initialServiceCatalog;
  quotations: Quotation[];
  invoices: Invoice[];
  activityLogs: ActivityLog[];
  clientInteractions: ClientInteraction[];
  suggestedPackages: SuggestedPackage[];
};

const globalWithStore = global as typeof global & { __mock_store: MockStore };

if (!globalWithStore.__mock_store) {
  globalWithStore.__mock_store = {
    clients: [...initialClients],
    serviceCatalog: [...initialServiceCatalog],
    quotations: [...initialQuotations],
    invoices: [...initialInvoices],
    activityLogs: [...initialActivityLogs],
    clientInteractions: [...initialClientInteractions],
    suggestedPackages: [...initialSuggestedPackages]
  };
}

const store: MockStore = globalWithStore.__mock_store;

function nextId(prefix: string, collectionSize: number) {
  return `${prefix}-${String(collectionSize + 1001)}`;
}

function nextQuotationNumber() {
  return `QT-2026-${String(store.quotations.length + 1001)}`;
}

function nextInvoiceNumber() {
  return `INV-2026-${String(store.invoices.length + 1001)}`;
}

function appendActivity(
  clientId: string,
  entityType: "quotation" | "invoice",
  entityId: string,
  action: ActivityLog["action"],
  message: string
) {
  store.activityLogs.unshift({
    id: nextId("log", store.activityLogs.length),
    clientId,
    entityType,
    entityId,
    action,
    message,
    createdAt: new Date().toISOString()
  });
}

export function getClients() {
  return store.clients;
}

export function getClientById(clientId: string) {
  return store.clients.find((client) => client.id === clientId);
}

export function getQuotationById(quotationId: string) {
  return store.quotations.find((quotation) => quotation.id === quotationId);
}

export function getInvoices() {
  return store.invoices;
}

export function getQuotations() {
  return store.quotations;
}

export function getServiceCatalog() {
  return store.serviceCatalog;
}

export function getSuggestedPackages() {
  return store.suggestedPackages;
}

export function getActivityLogs() {
  return store.activityLogs;
}

export function createQuotation(input: CreateQuotationInput) {
  const quotation: Quotation = {
    ...input,
    id: nextId("qt", store.quotations.length),
    quotationNumber: nextQuotationNumber(),
    createdAt: new Date().toISOString()
  };

  store.quotations.unshift(quotation);
  appendActivity(
    quotation.clientId,
    "quotation",
    quotation.id,
    "generated",
    `${quotation.quotationNumber} generated from source request text.`
  );
  return quotation;
}

export function createInvoiceFromQuotation(quotationId: string) {
  const quotation = getQuotationById(quotationId);

  if (!quotation) {
    throw new Error("Quotation not found");
  }

  const invoice: Invoice = {
    id: nextId("inv", store.invoices.length),
    quotationId: quotation.id,
    clientId: quotation.clientId,
    invoiceNumber: nextInvoiceNumber(),
    issueDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    lineItems: quotation.lineItems,
    subtotal: quotation.subtotal,
    taxPercent: quotation.taxPercent,
    taxAmount: quotation.taxAmount,
    total: quotation.total,
    paymentStatus: "unpaid"
  };

  store.invoices.unshift(invoice);
  appendActivity(
    invoice.clientId,
    "invoice",
    invoice.id,
    "converted",
    `${invoice.invoiceNumber} created from ${quotation.quotationNumber}.`
  );
  return invoice;
}

export function updateQuotationStatus(
  quotationId: string,
  status: QuotationStatus
) {
  const quotation = getQuotationById(quotationId);

  if (!quotation) {
    throw new Error("Quotation not found");
  }

  quotation.status = status;

  if (status === "sent") quotation.sentAt = new Date().toISOString();
  if (status === "opened") quotation.openedAt = new Date().toISOString();
  if (status === "approved") quotation.approvedAt = new Date().toISOString();

  const actionMap: Record<QuotationStatus, ActivityLog["action"]> = {
    draft: "generated",
    generated: "generated",
    sent: "sent_email",
    opened: "opened",
    approved: "approved"
  };

  appendActivity(
    quotation.clientId,
    "quotation",
    quotation.id,
    actionMap[status],
    `${quotation.quotationNumber} marked as ${status}.`
  );

  return quotation;
}

export function updateInvoiceStatus(
  invoiceId: string,
  paymentStatus: InvoicePaymentStatus
) {
  const invoice = store.invoices.find((item) => item.id === invoiceId);

  if (!invoice) {
    throw new Error("Invoice not found");
  }

  invoice.paymentStatus = paymentStatus;
  invoice.paidAt = paymentStatus === "paid" ? new Date().toISOString() : undefined;

  const actionMap: Record<InvoicePaymentStatus, ActivityLog["action"]> = {
    unpaid: "converted",
    paid: "paid",
    overdue: "overdue"
  };

  appendActivity(
    invoice.clientId,
    "invoice",
    invoice.id,
    actionMap[paymentStatus],
    `${invoice.invoiceNumber} updated to ${paymentStatus}.`
  );

  return invoice;
}

export function getClientHistory(clientId: string) {
  const client = getClientById(clientId);

  return {
    client,
    quotations: store.quotations.filter((quotation) => quotation.clientId === clientId),
    invoices: store.invoices.filter((invoice) => invoice.clientId === clientId),
    activityLogs: store.activityLogs.filter((log) => log.clientId === clientId),
    interactions: store.clientInteractions.filter(
      (interaction) => interaction.clientId === clientId
    ),
    pastServices: client?.pastServices ?? []
  };
}
