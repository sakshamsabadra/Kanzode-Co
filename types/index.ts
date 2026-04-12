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

export type ActivityType =
  | "generated"
  | "converted"
  | "sent_email"
  | "sent_whatsapp"
  | "opened"
  | "approved"
  | "paid"
  | "overdue";

export type InteractionChannel = "email" | "whatsapp" | "call" | "meeting";

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

export interface ServiceCatalogItem {
  id: string;
  name: string;
  category: string;
  description: string;
  unitPrice: number;
  billingModel: "one_time" | "monthly";
  defaultTaxPercent: number;
  tags: string[];
}

export interface QuotationLineItem {
  id: string;
  serviceCatalogItemId?: string;
  title: string;
  description: string;
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
  clientId: string;
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
  quotationId: string;
  clientId: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  lineItems: QuotationLineItem[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
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
