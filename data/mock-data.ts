import {
  ActivityLog,
  Client,
  ClientInteraction,
  Invoice,
  Party,
  Quotation,
  QuotationLineItem,
  ServiceCatalogItem,
  SuggestedPackage,
  Task
} from "@/types";

const quotationLineItemsA: QuotationLineItem[] = [
  {
    id: "qli-1001",
    serviceCatalogItemId: "svc-roc",
    title: "ROC compliance management",
    quantity: 1,
    unitPrice: 18000,
    amount: 18000
  },
  {
    id: "qli-1002",
    serviceCatalogItemId: "svc-gst",
    title: "GST and TDS compliance retainer",
    quantity: 1,
    unitPrice: 24000,
    amount: 24000
  },
  {
    id: "qli-1003",
    serviceCatalogItemId: "svc-contract",
    title: "Commercial contract review",
    quantity: 1,
    unitPrice: 12000,
    amount: 12000
  }
];

const quotationLineItemsB: QuotationLineItem[] = [
  {
    id: "qli-1004",
    serviceCatalogItemId: "svc-startup",
    title: "Startup structuring package",
    quantity: 1,
    unitPrice: 32000,
    amount: 32000
  },
  {
    id: "qli-1005",
    serviceCatalogItemId: "svc-contract",
    title: "Founder agreement review",
    quantity: 1,
    unitPrice: 12000,
    amount: 12000
  }
];

const quotationLineItemsC: QuotationLineItem[] = [
  {
    id: "qli-1006",
    serviceCatalogItemId: "svc-contract",
    title: "Commercial review desk",
    quantity: 1,
    unitPrice: 12000,
    amount: 12000
  },
  {
    id: "qli-1007",
    serviceCatalogItemId: "svc-cfo",
    title: "Virtual CFO desk",
    quantity: 1,
    unitPrice: 85000,
    amount: 85000
  }
];

export const initialServiceCatalog: ServiceCatalogItem[] = [
  {
    id: "svc-roc",
    name: "ROC compliance management",
    category: "Company Secretarial",
    unitPrice: 18000,
    billingModel: "monthly",
    defaultTaxPercent: 18,
    tags: ["roc", "secretarial", "monthly"]
  },
  {
    id: "svc-gst",
    name: "GST and TDS compliance retainer",
    category: "Taxation",
    unitPrice: 24000,
    billingModel: "monthly",
    defaultTaxPercent: 18,
    tags: ["gst", "tds", "retainer"]
  },
  {
    id: "svc-contract",
    name: "Commercial contract review",
    category: "Legal",
    unitPrice: 12000,
    billingModel: "one_time",
    defaultTaxPercent: 18,
    tags: ["agreement", "review", "legal"]
  },
  {
    id: "svc-cfo",
    name: "Virtual CFO desk",
    category: "Business Advisory",
    unitPrice: 85000,
    billingModel: "monthly",
    defaultTaxPercent: 18,
    tags: ["cfo", "mis", "finance"]
  },
  {
    id: "svc-startup",
    name: "Startup structuring package",
    category: "Business Setup",
    unitPrice: 32000,
    billingModel: "one_time",
    defaultTaxPercent: 18,
    tags: ["startup", "founders", "setup"]
  }
];

export const initialClients: Client[] = [
  {
    id: "cl-1001",
    name: "Harshita Jain",
    companyName: "Northstar Foods LLP",
    email: "harshita@northstarfoods.example",
    whatsappNumber: "+91 98765 12001",
    clientType: "sme",
    gstNumber: "27AAHFN1234L1ZV",
    pan: "AAHFN1234L",
    address: "Bandra Kurla Complex, Mumbai, Maharashtra",
    pastServices: [
      {
        id: "ps-1001",
        serviceName: "Monthly GST compliance",
        serviceCategory: "Taxation",
        price: 22000,
        completedAt: "2026-02-18T10:00:00.000Z"
      },
      {
        id: "ps-1002",
        serviceName: "Payroll setup review",
        serviceCategory: "Business Advisory",
        price: 9000,
        completedAt: "2026-01-10T10:00:00.000Z"
      }
    ],
    pricingPreferences: {
      preferredBillingCycle: "quarterly",
      preferredCurrency: "INR",
      anchorAmount: 28000,
      notes: ["Prefers bundled compliance fees", "Approvals happen on WhatsApp"]
    },
    standardTerms: [
      "Quarterly billing in advance",
      "Client data to be shared by the 5th of each month",
      "Urgent reviews are handled within 48 working hours"
    ],
    createdAt: "2025-12-14T09:00:00.000Z",
    updatedAt: "2026-04-02T09:20:00.000Z"
  },
  {
    id: "cl-1002",
    name: "Rohit Iyer",
    companyName: "Rivermark Health Private Limited",
    email: "rohit@rivermark.example",
    whatsappNumber: "+91 98111 22334",
    clientType: "startup",
    gstNumber: "29AACCR4567J1ZT",
    pan: "AACCR4567J",
    address: "Indiranagar, Bengaluru, Karnataka",
    pastServices: [
      {
        id: "ps-1003",
        serviceName: "Founders agreement review",
        serviceCategory: "Legal",
        price: 15000,
        completedAt: "2026-03-12T10:00:00.000Z"
      }
    ],
    pricingPreferences: {
      preferredBillingCycle: "one_time",
      preferredCurrency: "INR",
      anchorAmount: 45000,
      notes: ["Needs board-ready summaries", "Prefers email plus WhatsApp"]
    },
    standardTerms: [
      "50% advance before drafting begins",
      "Final balance before execution pack handover"
    ],
    createdAt: "2026-01-08T09:00:00.000Z",
    updatedAt: "2026-04-01T11:00:00.000Z"
  },
  {
    id: "cl-1003",
    name: "Sana D'Souza",
    companyName: "Aster Legal Consulting",
    email: "sana@asterlegal.example",
    whatsappNumber: "+91 98989 99887",
    clientType: "professional_firm",
    pastServices: [],
    pricingPreferences: {
      preferredBillingCycle: "monthly",
      preferredCurrency: "INR",
      anchorAmount: 15000
    },
    standardTerms: [
      "Urgent work billed separately",
      "Turnaround depends on document completeness"
    ],
    createdAt: "2026-03-20T09:00:00.000Z",
    updatedAt: "2026-04-03T16:30:00.000Z"
  },
  {
    id: "cl-1004",
    name: "Megha Batra",
    companyName: "Bridgeline Commerce India",
    email: "megha@bridgeline.example",
    whatsappNumber: "+91 98202 77881",
    clientType: "foreign_subsidiary",
    gstNumber: "07AAACB7788P1Z4",
    pan: "AAACB7788P",
    address: "Aerocity, New Delhi",
    pastServices: [
      {
        id: "ps-1004",
        serviceName: "Virtual CFO retainer",
        serviceCategory: "Business Advisory",
        price: 85000,
        completedAt: "2026-02-28T10:00:00.000Z"
      }
    ],
    pricingPreferences: {
      preferredBillingCycle: "monthly",
      preferredCurrency: "INR",
      anchorAmount: 85000,
      notes: ["Needs GST breakup on all invoices"]
    },
    standardTerms: [
      "Invoices must include GST breakup",
      "Payment reminders to finance and promoter team"
    ],
    createdAt: "2025-11-05T09:00:00.000Z",
    updatedAt: "2026-03-31T18:10:00.000Z"
  }
];

export const initialParties: Party[] = [
  {
    id: "pty-1001",
    name: "Vikram Mehta",
    address: "12 MG Road, Pune, Maharashtra 411001",
    email: "vikram@mehtaindustries.example",
    phoneNumber: "+91 98223 44556",
    createdAt: "2026-01-15T09:00:00.000Z",
    updatedAt: "2026-03-20T11:00:00.000Z"
  },
  {
    id: "pty-1002",
    name: "Priya Sharma",
    address: "45 Civil Lines, Nagpur, Maharashtra 440001",
    email: "priya@sharmaassociates.example",
    phoneNumber: "+91 98765 11223",
    createdAt: "2026-02-10T09:00:00.000Z",
    updatedAt: "2026-04-01T14:30:00.000Z"
  },
  {
    id: "pty-1003",
    name: "Arjun Reddy",
    address: "78 Jubilee Hills, Hyderabad, Telangana 500033",
    email: "arjun@reddyholdings.example",
    phoneNumber: "+91 99887 76655",
    createdAt: "2026-03-05T09:00:00.000Z",
    updatedAt: "2026-04-02T10:00:00.000Z"
  }
];

export const initialSuggestedPackages: SuggestedPackage[] = [
  {
    id: "pkg-1001",
    clientType: "sme",
    packageName: "Compliance Retainer Plus",
    rationale: "Best fit for recurring statutory work with occasional contract support.",
    includedServiceIds: ["svc-roc", "svc-gst", "svc-contract"],
    recommendedTerms: [
      "Quarterly billing in advance",
      "Shared calendar for compliance milestones"
    ],
    estimatedSubtotal: 54000,
    matchScore: 92
  },
  {
    id: "pkg-1002",
    clientType: "startup",
    packageName: "Founder Launch Stack",
    rationale: "Works well for founders needing setup, documentation, and quick legal support.",
    includedServiceIds: ["svc-startup", "svc-contract"],
    recommendedTerms: [
      "50% advance before drafting begins",
      "Execution support included in final delivery"
    ],
    estimatedSubtotal: 44000,
    matchScore: 88
  },
  {
    id: "pkg-1003",
    clientType: "professional_firm",
    packageName: "Advisory Acceleration Desk",
    rationale: "Useful for firms adding outsourced finance and commercial review depth.",
    includedServiceIds: ["svc-contract", "svc-cfo"],
    recommendedTerms: [
      "Monthly retainer invoiced in advance",
      "Urgent work billed outside scope"
    ],
    estimatedSubtotal: 97000,
    matchScore: 76
  }
];

export const initialQuotations: Quotation[] = [
  {
    id: "qt-1001",
    quotationNumber: "QT-2026-1001",
    challanNumber: "CH-2026-1001",
    clientId: "cl-1001",
    partyId: "pty-1001",
    quotationType: "manual",
    sourceText:
      "Need GST, payroll, ROC filings, and one urgent vendor agreement review. Please send on email and WhatsApp.",
    extractedIntent: "Monthly compliance retainer with one urgent legal review.",
    lineItems: quotationLineItemsA,
    subtotal: 54000,
    taxPercent: 18,
    taxAmount: 9720,
    total: 63720,
    status: "sent",
    validityDays: 7,
    terms: [
      "Quarterly billing in advance",
      "Client data to be shared by the 5th of each month",
      "Urgent reviews are handled within 48 working hours"
    ],
    notes: "Created from WhatsApp-style intake and shared over both channels.",
    createdAt: "2026-04-02T09:30:00.000Z",
    sentAt: "2026-04-02T10:00:00.000Z",
    openedAt: "2026-04-03T10:15:00.000Z"
  },
  {
    id: "qt-1002",
    quotationNumber: "QT-2026-1002",
    challanNumber: "CH-2026-1002",
    clientId: "cl-1002",
    quotationType: "direct_invoice",
    sourceText:
      "We need incorporation cleanup, founder agreement review, and startup compliance baseline support.",
    extractedIntent: "Founder documentation and structuring support package.",
    lineItems: quotationLineItemsB,
    subtotal: 44000,
    taxPercent: 18,
    taxAmount: 7920,
    total: 51920,
    status: "approved",
    validityDays: 10,
    terms: [
      "50% advance before drafting begins",
      "Final balance before execution pack handover"
    ],
    notes: "Founder requested summary version for board sharing.",
    createdAt: "2026-04-01T11:15:00.000Z",
    sentAt: "2026-04-01T11:40:00.000Z",
    openedAt: "2026-04-01T12:10:00.000Z",
    approvedAt: "2026-04-02T09:20:00.000Z"
  },
  {
    id: "qt-1003",
    quotationNumber: "QT-2026-1003",
    challanNumber: "CH-2026-1003",
    clientId: "cl-1003",
    partyId: "pty-1002",
    quotationType: "manual",
    sourceText:
      "Need outsourced commercial reviews and periodic finance strategy inputs for client transactions.",
    extractedIntent: "Recurring advisory desk combining contract review and CFO support.",
    lineItems: quotationLineItemsC,
    subtotal: 97000,
    taxPercent: 18,
    taxAmount: 17460,
    total: 114460,
    status: "draft",
    validityDays: 5,
    terms: [
      "Urgent work billed separately",
      "Turnaround depends on document completeness"
    ],
    notes: "Draft saved pending partner review.",
    createdAt: "2026-04-03T16:45:00.000Z"
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: "inv-1001",
    quotationId: "qt-1001",
    challanNumber: "CH-2026-1001",
    clientId: "cl-1001",
    partyId: "pty-1001",
    invoiceNumber: "INV-2026-1001",
    issueDate: "2026-04-03T09:00:00.000Z",
    dueDate: "2026-04-10T18:00:00.000Z",
    lineItems: quotationLineItemsA,
    subtotal: 54000,
    taxPercent: 18,
    taxAmount: 9720,
    total: 63720,
    paidAmount: 63720,
    paymentStatus: "paid",
    paidAt: "2026-04-03T17:20:00.000Z"
  },
  {
    id: "inv-1002",
    quotationId: "qt-1002",
    challanNumber: "CH-2026-1002",
    clientId: "cl-1002",
    invoiceNumber: "INV-2026-1002",
    issueDate: "2026-04-02T14:10:00.000Z",
    dueDate: "2026-04-10T18:00:00.000Z",
    lineItems: quotationLineItemsB,
    subtotal: 44000,
    taxPercent: 18,
    taxAmount: 7920,
    total: 51920,
    paidAmount: 0,
    paymentStatus: "unpaid"
  },
  {
    id: "inv-1003",
    challanNumber: "CH-2026-1003",
    clientId: "cl-1004",
    partyId: "pty-1003",
    invoiceNumber: "INV-2026-1003",
    issueDate: "2026-03-25T10:00:00.000Z",
    dueDate: "2026-04-10T18:00:00.000Z",
    lineItems: [
      {
        id: "qli-1008",
        serviceCatalogItemId: "svc-cfo",
        title: "Virtual CFO desk",
        quantity: 1,
        unitPrice: 85000,
        amount: 85000
      }
    ],
    subtotal: 85000,
    taxPercent: 18,
    taxAmount: 15300,
    total: 100300,
    paidAmount: 0,
    paymentStatus: "overdue"
  }
];

export const initialTasks: Task[] = [
  {
    id: "task-1001",
    taskName: "File GST returns for Northstar Foods",
    assignedTo: "Rahul K",
    status: "in_progress",
    createdAt: "2026-04-01T09:00:00.000Z",
    updatedAt: "2026-04-03T10:00:00.000Z"
  },
  {
    id: "task-1002",
    taskName: "Prepare board minutes for Rivermark Health",
    assignedTo: "Sneha P",
    status: "pending",
    createdAt: "2026-04-02T11:00:00.000Z",
    updatedAt: "2026-04-02T11:00:00.000Z"
  },
  {
    id: "task-1003",
    taskName: "Review founder agreement draft",
    assignedTo: "Amit S",
    status: "completed",
    createdAt: "2026-03-28T14:00:00.000Z",
    updatedAt: "2026-04-01T16:30:00.000Z"
  },
  {
    id: "task-1004",
    taskName: "Follow up on overdue invoice INV-2026-1003",
    assignedTo: "Rahul K",
    status: "pending",
    createdAt: "2026-04-03T09:00:00.000Z",
    updatedAt: "2026-04-03T09:00:00.000Z"
  }
];

export const initialActivityLogs: ActivityLog[] = [
  {
    id: "log-1001",
    clientId: "cl-1001",
    entityType: "quotation",
    entityId: "qt-1001",
    action: "opened",
    message: "Northstar Foods opened the quotation from the portal link.",
    createdAt: "2026-04-03T10:15:00.000Z"
  },
  {
    id: "log-1002",
    clientId: "cl-1001",
    entityType: "invoice",
    entityId: "inv-1001",
    action: "paid",
    message: "Invoice marked paid against bank statement confirmation.",
    createdAt: "2026-04-03T17:20:00.000Z"
  },
  {
    id: "log-1003",
    clientId: "cl-1002",
    entityType: "quotation",
    entityId: "qt-1002",
    action: "approved",
    message: "Founder approved the quotation after reviewing the summary note.",
    createdAt: "2026-04-02T09:20:00.000Z"
  },
  {
    id: "log-1004",
    clientId: "cl-1001",
    entityType: "quotation",
    entityId: "qt-1001",
    action: "sent_portal",
    message: "Quotation delivered through portal automatically.",
    createdAt: "2026-04-02T10:05:00.000Z"
  },
  {
    id: "log-1005",
    clientId: "cl-1004",
    entityType: "invoice",
    entityId: "inv-1003",
    action: "overdue",
    message: "Invoice exceeded due date and moved to overdue follow-up.",
    createdAt: "2026-04-01T09:00:00.000Z"
  }
];

export const initialClientInteractions: ClientInteraction[] = [
  {
    id: "int-1001",
    clientId: "cl-1001",
    channel: "whatsapp",
    summary: "Client asked for bundled compliance fee and one urgent contract review.",
    createdAt: "2026-04-02T09:00:00.000Z",
    relatedQuotationId: "qt-1001"
  },
  {
    id: "int-1002",
    clientId: "cl-1002",
    channel: "email",
    summary: "Founder requested board-shareable summary with milestone-based billing.",
    createdAt: "2026-04-01T10:55:00.000Z",
    relatedQuotationId: "qt-1002"
  },
  {
    id: "int-1003",
    clientId: "cl-1004",
    channel: "call",
    summary: "Finance team requested payment reminder and GST-inclusive invoice copy.",
    createdAt: "2026-03-31T11:00:00.000Z",
    relatedInvoiceId: "inv-1003"
  }
];
