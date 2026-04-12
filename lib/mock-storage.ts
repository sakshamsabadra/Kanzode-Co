import {
  initialActivityLogs,
  initialClientInteractions,
  initialClients,
  initialInvoices,
  initialParties,
  initialQuotations,
  initialServiceCatalog,
  initialSuggestedPackages,
  initialTasks
} from "@/data/mock-data";
import {
  ActivityLog,
  Client,
  ClientInteraction,
  Invoice,
  InvoicePaymentStatus,
  Party,
  Quotation,
  QuotationStatus,
  QuotationType,
  SuggestedPackage,
  Task,
  TaskStatus
} from "@/types";

type CreateQuotationInput = Omit<
  Quotation,
  "id" | "quotationNumber" | "challanNumber" | "createdAt" | "sentAt" | "openedAt" | "approvedAt"
>;

type MockStore = {
  clients: Client[];
  serviceCatalog: typeof initialServiceCatalog;
  quotations: Quotation[];
  invoices: Invoice[];
  activityLogs: ActivityLog[];
  clientInteractions: ClientInteraction[];
  suggestedPackages: SuggestedPackage[];
  parties: Party[];
  tasks: Task[];
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
    suggestedPackages: [...initialSuggestedPackages],
    parties: [...initialParties],
    tasks: [...initialTasks]
  };
}

const store: MockStore = globalWithStore.__mock_store;

function nextId(prefix: string, collectionSize: number) {
  return `${prefix}-${String(collectionSize + 1001)}`;
}

function nextQuotationNumber() {
  return `QT-2026-${String(store.quotations.length + 1001)}`;
}

function nextChallanNumber() {
  return `CH-2026-${String(store.quotations.length + store.invoices.length + 1001)}`;
}

function nextInvoiceNumber() {
  return `INV-2026-${String(store.invoices.length + 1001)}`;
}

function get10thOfNextMonth(date: Date): string {
  const d = new Date(date);
  if (d.getDate() >= 10) {
    d.setMonth(d.getMonth() + 1);
  }
  d.setDate(10);
  d.setHours(18, 0, 0, 0);
  return d.toISOString();
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

export function getInvoiceById(invoiceId: string) {
  return store.invoices.find((invoice) => invoice.id === invoiceId);
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

export function getParties() {
  return store.parties;
}

export function getPartyById(partyId: string) {
  return store.parties.find((party) => party.id === partyId);
}

export function getTasks() {
  return store.tasks;
}

export function createParty(input: Omit<Party, "id" | "createdAt" | "updatedAt">) {
  const party: Party = {
    ...input,
    id: nextId("pty", store.parties.length),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  store.parties.unshift(party);
  return party;
}

export function updateParty(partyId: string, input: Partial<Omit<Party, "id" | "createdAt" | "updatedAt">>) {
  const party = store.parties.find((p) => p.id === partyId);
  if (!party) throw new Error("Party not found");
  Object.assign(party, input, { updatedAt: new Date().toISOString() });
  return party;
}

export function deleteParty(partyId: string) {
  store.parties = store.parties.filter((p) => p.id !== partyId);
}

export function createTask(input: Omit<Task, "id" | "createdAt" | "updatedAt">) {
  const task: Task = {
    ...input,
    id: nextId("task", store.tasks.length),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  store.tasks.unshift(task);
  return task;
}

export function updateTask(taskId: string, input: Partial<Omit<Task, "id" | "createdAt" | "updatedAt">>) {
  const task = store.tasks.find((t) => t.id === taskId);
  if (!task) throw new Error("Task not found");
  Object.assign(task, input, { updatedAt: new Date().toISOString() });
  return task;
}

export function deleteTask(taskId: string) {
  store.tasks = store.tasks.filter((t) => t.id !== taskId);
}

export function addServiceCatalogItem(input: Omit<typeof initialServiceCatalog[0], "id">) {
  const item = {
    ...input,
    id: nextId("svc", store.serviceCatalog.length)
  };
  store.serviceCatalog.push(item);
  return item;
}

export function updateServiceCatalogItem(itemId: string, input: Partial<Omit<typeof initialServiceCatalog[0], "id">>) {
  const item = store.serviceCatalog.find((s) => s.id === itemId);
  if (!item) throw new Error("Service item not found");
  Object.assign(item, input);
  return item;
}

export function deleteServiceCatalogItem(itemId: string) {
  store.serviceCatalog = store.serviceCatalog.filter((s) => s.id !== itemId);
}

export function moveServiceCatalogItem(itemId: string, direction: "up" | "down") {
  const idx = store.serviceCatalog.findIndex((s) => s.id === itemId);
  if (idx === -1) return;
  const targetIdx = direction === "up" ? idx - 1 : idx + 1;
  if (targetIdx < 0 || targetIdx >= store.serviceCatalog.length) return;
  const temp = store.serviceCatalog[idx];
  store.serviceCatalog[idx] = store.serviceCatalog[targetIdx];
  store.serviceCatalog[targetIdx] = temp;
}

export function copyServiceCatalogItem(itemId: string) {
  const item = store.serviceCatalog.find((s) => s.id === itemId);
  if (!item) return;
  const copy = {
    ...item,
    id: nextId("svc", store.serviceCatalog.length),
    name: `${item.name} (Copy)`
  };
  const idx = store.serviceCatalog.findIndex((s) => s.id === itemId);
  store.serviceCatalog.splice(idx + 1, 0, copy);
  return copy;
}

export function createQuotation(input: CreateQuotationInput) {
  const quotation: Quotation = {
    ...input,
    id: nextId("qt", store.quotations.length),
    quotationNumber: nextQuotationNumber(),
    challanNumber: nextChallanNumber(),
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

export function updateQuotationLineItems(quotationId: string, lineItems: Quotation["lineItems"]) {
  const quotation = getQuotationById(quotationId);
  if (!quotation) throw new Error("Quotation not found");
  quotation.lineItems = lineItems;
  quotation.subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  quotation.taxAmount = Math.round((quotation.subtotal * quotation.taxPercent) / 100);
  quotation.total = quotation.subtotal + quotation.taxAmount;
  return quotation;
}

export function createInvoiceFromQuotation(quotationId: string) {
  const quotation = getQuotationById(quotationId);

  if (!quotation) {
    throw new Error("Quotation not found");
  }

  const issueDate = new Date();
  const invoice: Invoice = {
    id: nextId("inv", store.invoices.length),
    quotationId: quotation.id,
    challanNumber: quotation.challanNumber,
    clientId: quotation.clientId,
    partyId: quotation.partyId,
    invoiceNumber: nextInvoiceNumber(),
    issueDate: issueDate.toISOString(),
    dueDate: get10thOfNextMonth(issueDate),
    lineItems: quotation.lineItems,
    subtotal: quotation.subtotal,
    taxPercent: quotation.taxPercent,
    taxAmount: quotation.taxAmount,
    total: quotation.total,
    paidAmount: 0,
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

export function createInvoiceManual(input: Omit<Invoice, "id" | "invoiceNumber" | "challanNumber" | "dueDate" | "createdAt">) {
  const issueDate = new Date(input.issueDate);
  const invoice: Invoice = {
    ...input,
    id: nextId("inv", store.invoices.length),
    invoiceNumber: nextInvoiceNumber(),
    challanNumber: nextChallanNumber(),
    dueDate: get10thOfNextMonth(issueDate),
    paidAmount: input.paidAmount ?? 0
  };

  store.invoices.unshift(invoice);
  appendActivity(
    invoice.clientId,
    "invoice",
    invoice.id,
    "converted",
    `${invoice.invoiceNumber} created manually.`
  );
  return invoice;
}

export function updateInvoiceLineItems(invoiceId: string, lineItems: Invoice["lineItems"]) {
  const invoice = store.invoices.find((i) => i.id === invoiceId);
  if (!invoice) throw new Error("Invoice not found");
  invoice.lineItems = lineItems;
  invoice.subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  invoice.taxAmount = Math.round((invoice.subtotal * invoice.taxPercent) / 100);
  invoice.total = invoice.subtotal + invoice.taxAmount;
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
    sent: "sent_portal",
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
  if (paymentStatus === "paid") invoice.paidAmount = invoice.total;

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
