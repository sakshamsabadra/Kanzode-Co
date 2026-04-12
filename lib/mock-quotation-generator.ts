import {
  Client,
  ClientType,
  QuotationLineItem,
  QuotationType,
  ServiceCatalogItem,
  SuggestedPackage
} from "@/types";

interface GenerateMockQuotationDraftArgs {
  client: Client;
  sourceText: string;
  serviceCatalog: ServiceCatalogItem[];
  suggestedPackages: SuggestedPackage[];
  quotationType?: QuotationType;
}

interface ExtractedServicePreview {
  id: string;
  name: string;
  whyMatched: string;
}

export interface MockQuotationDraft {
  extractedServices: ExtractedServicePreview[];
  urgency: "Standard" | "Urgent";
  clientType: ClientType;
  quotationType: QuotationType;
  suggestedTerms: string[];
  pricingHints: string[];
  lineItems: QuotationLineItem[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
  validityLabel: string;
  notes: string;
  terms: string[];
}

function includesKeyword(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}

function matchServices(sourceText: string, serviceCatalog: ServiceCatalogItem[]) {
  const normalized = sourceText.toLowerCase();

  return serviceCatalog.filter((service) => {
    const lookup: Record<string, string[]> = {
      "svc-startup": ["private limited", "incorporation", "founders", "startup"],
      "svc-gst": ["gst", "registration", "tds", "tax"],
      "svc-contract": ["agreement", "draft", "review", "contract", "founders agreement"],
      "svc-roc": ["roc", "compliance", "filing", "board"],
      "svc-cfo": ["cfo", "mis", "finance", "pricing", "budget"]
    };

    return includesKeyword(normalized, lookup[service.id] ?? []);
  });
}

export function generateMockQuotationDraft({
  client,
  sourceText,
  serviceCatalog,
  suggestedPackages,
  quotationType = "manual"
}: GenerateMockQuotationDraftArgs): MockQuotationDraft {
  const normalized = sourceText.toLowerCase();
  const urgency =
    includesKeyword(normalized, ["urgent", "today", "asap", "immediately"]) ? "Urgent" : "Standard";
  const serviceMatches = matchServices(sourceText, serviceCatalog);
  const fallbackPackage = suggestedPackages.find(
    (item) => item.clientType === client.clientType
  );
  const fallbackServices =
    serviceMatches.length > 0
      ? serviceMatches
      : serviceCatalog.filter((service) =>
          fallbackPackage?.includedServiceIds.includes(service.id)
        );

  const multiplier = urgency === "Urgent" ? 1.15 : 1;
  const lineItems: QuotationLineItem[] = fallbackServices.map((service, index) => {
    const boostedUnitPrice = Math.round(service.unitPrice * multiplier);
    return {
      id: `draft-line-${index + 1}`,
      serviceCatalogItemId: service.id,
      title:
        service.id === "svc-contract" && normalized.includes("founders")
          ? "Founders agreement draft"
          : service.name,
      quantity: 1,
      unitPrice: boostedUnitPrice,
      amount: boostedUnitPrice
    };
  });

  const subtotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
  const taxPercent = 18;
  const taxAmount = Math.round((subtotal * taxPercent) / 100);
  const total = subtotal + taxAmount;
  const suggestedTerms = [
    ...client.standardTerms,
    ...(fallbackPackage?.recommendedTerms ?? [])
  ].slice(0, 4);

  const pricingHints = [
    client.pricingPreferences?.anchorAmount
      ? `Client pricing anchor is around INR ${client.pricingPreferences.anchorAmount.toLocaleString(
          "en-IN"
        )}.`
      : "No explicit pricing anchor captured yet.",
    ...(client.pricingPreferences?.notes ?? []),
    urgency === "Urgent"
      ? "Urgency uplift applied to reflect same-day or priority turnaround."
      : "Standard turnaround used for pricing."
  ].slice(0, 4);

  return {
    extractedServices: fallbackServices.map((service) => ({
      id: service.id,
      name: service.name,
      whyMatched: `Matched from request keywords and ${client.clientType.replace("_", " ")} client context.`
    })),
    urgency,
    clientType: client.clientType,
    quotationType,
    suggestedTerms,
    pricingHints,
    lineItems,
    subtotal,
    taxPercent,
    taxAmount,
    total,
    validityLabel: urgency === "Urgent" ? "Valid for 3 days" : "Valid for 7 days",
    notes:
      urgency === "Urgent"
        ? "Priority delivery assumed. Draft can be positioned as urgent same-day support."
        : "Standard delivery window applied. Scope can be tightened further before sending.",
    terms: suggestedTerms
  };
}
