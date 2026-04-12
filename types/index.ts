export type ClientType =
  | "startup"
  | "sme"
  | "professional_firm"
  | "foreign_subsidiary";

export type QuotationStatus =
  | "draft"
  | "generated"
  | "sent"
  | "opened"
  | "approved";

export type InvoicePaymentStatus = "unpaid" | "paid" | "overdue";

export type QuotationType = "direct_invoice" | "manual";

export type ActivityType =
  | "generated"
  | "converted"
  | "sent_email"
  | "sent_whatsapp"
  | "sent_portal"
  | "opened"
  | "approved"
  | "paid"
  | "overdue";

export type InteractionChannel = "email" | "whatsapp" | "call" | "meeting";

export type TaskStatus = "pending" | "in_progress" | "completed";

export interface PricingPreferences {
  preferredBillingCycle?: "one_time" | "monthly" | "quarterly" | "annual";
  preferredCurrency?: "INR";
  anchorAmount?: number;
  notes?: string[];
}

export interface ClientPastService {
  id: string;
  serviceName: string;
  serviceCategory: string;
  price: number;
  completedAt: string;
}

export interface Client {
  id: string;
  name: string;
  companyName: string;
  email: string;
  whatsappNumber: string;
  clientType: ClientType;
  gstNumber?: string;
  pan?: string;
  address?: string;
  pastServices: ClientPastService[];
  pricingPreferences?: PricingPreferences;
  standardTerms: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Party {
  id: string;
  name: string;
  address: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceCatalogItem {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  billingModel: "one_time" | "monthly";
  defaultTaxPercent: number;
  tags: string[];
}

export interface QuotationLineItem {
  id: string;
  serviceCatalogItemId?: string;
  title: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface SuggestedPackage {
  id: string;
  clientType: ClientType;
  packageName: string;
  rationale: string;
  includedServiceIds: string[];
  recommendedTerms: string[];
  estimatedSubtotal: number;
  matchScore: number;
}

export interface Quotation {
  id: string;
  quotationNumber: string;
  challanNumber: string;
  clientId: string;
  partyId?: string;
  quotationType: QuotationType;
  sourceText: string;
  extractedIntent: string;
  lineItems: QuotationLineItem[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
  status: QuotationStatus;
  validityDays: number;
  terms: string[];
  notes: string;
  createdAt: string;
  sentAt?: string;
  openedAt?: string;
  approvedAt?: string;
}

export interface Invoice {
  id: string;
  quotationId?: string;
  challanNumber: string;
  clientId: string;
  partyId?: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  lineItems: QuotationLineItem[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
  paidAmount: number;
  paymentStatus: InvoicePaymentStatus;
  paidAt?: string;
}

export interface ActivityLog {
  id: string;
  clientId: string;
  entityType: "quotation" | "invoice";
  entityId: string;
  action: ActivityType;
  message: string;
  createdAt: string;
}

export interface ClientInteraction {
  id: string;
  clientId: string;
  channel: InteractionChannel;
  summary: string;
  createdAt: string;
  relatedQuotationId?: string;
  relatedInvoiceId?: string;
}

export interface Task {
  id: string;
  taskName: string;
  assignedTo: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}
