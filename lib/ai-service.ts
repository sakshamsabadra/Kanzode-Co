import { Client, ServiceCatalogItem, SuggestedPackage } from "@/types";
import { MockQuotationDraft } from "./quotation-generator";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "openai/gpt-oss-120b:free";

export async function analyzeRequestWithAI(
  sourceText: string,
  client: Client,
  serviceCatalog: ServiceCatalogItem[],
  suggestedPackages: SuggestedPackage[]
): Promise<MockQuotationDraft> {
  if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY === "PASTE_YOUR_OPENROUTER_KEY_HERE") {
    console.warn("OpenRouter API key not configured. Falling back to mock analysis.");
    throw new Error("AI_KEY_MISSING");
  }

  // Null-safe access – some clients created via quick-add may lack these fields
  const clientTerms = Array.isArray(client.standardTerms)
    ? client.standardTerms.join(", ")
    : "50% advance before work begins";

  const systemPrompt = `You are the Senior Managing Partner at Kanzode & Co.

Goal: Convert an unstructured client request into a quotation draft.

Client type: ${client.clientType ?? "startup"}
Standard engagement terms: ${clientTerms}

Service catalog (map ONLY to these IDs):
${serviceCatalog.map((s) => `- {"id":"${s.id || (s as any)._id}","name":"${s.name}","unitPrice":${s.unitPrice}}`).join("\n")}

Rules:
- Map requested work to closest services from catalog.
- If urgency is "Urgent", apply 15% premium on unitPrice.
- Produce professional advisory notes per line item.
- Return ONLY valid JSON (no markdown, no code fences).

Return JSON with these exact keys:
{
  "urgency": "Standard" or "Urgent",
  "quotationType": "manual",
  "extractedServices": [{"id":"...", "name":"...", "whyMatched":"..."}],
  "lineItems": [{"id":"draft-line-1", "serviceCatalogItemId":"...", "title":"...", "quantity":1, "unitPrice":number, "amount":number}],
  "subtotal": number,
  "taxPercent": 0,
  "taxAmount": 0,
  "total": number,
  "terms": ["term1", "term2"],
  "notes": "string",
  "enhancedText": "string"
}

The "enhancedText" should be a professional, well-structured version of the raw "CLIENT REQUEST" provided by the user. Convert informal or shorthand requests into a formal proposal description.`

  const userPrompt = `CLIENT REQUEST: "${sourceText}"`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://kanzode.co",
        "X-Title": "Kanzode & Co"
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.2,
        max_tokens: 1500,
        response_format: { type: "json_object" }
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      if (response.status === 503) {
        throw new Error("The AI model provider is currently overloaded or undergoing maintenance. Please try again in 30 seconds.");
      }
      throw new Error(`OpenRouter API failed: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.choices || data.choices.length === 0) {
      console.error("OpenRouter Response:", data);
      throw new Error("AI returned an empty response. Check if the model is available.");
    }

    let content = data.choices[0].message?.content;

    if (!content || typeof content !== "string") {
      console.error("OpenRouter Response (no content):", data);
      throw new Error("AI returned empty or invalid content. The model may be overloaded or unavailable.");
    }

    // Safety: Strip markdown code blocks if the model ignores the json_object instruction
    content = content.replace(/```json\n?|```/g, "").trim();

    let aiOutput: any;
    try {
      aiOutput = JSON.parse(content);
    } catch (parseErr) {
      console.error("Failed to parse AI JSON:", content);
      throw new Error("AI returned malformed JSON. Try again.");
    }

    // Build a complete MockQuotationDraft with safe fallbacks for every field
    const urgency = aiOutput.urgency === "Urgent" ? "Urgent" : "Standard";

    return {
      extractedServices: Array.isArray(aiOutput.extractedServices) ? aiOutput.extractedServices : [],
      lineItems: Array.isArray(aiOutput.lineItems) ? aiOutput.lineItems : [],
      urgency,
      quotationType: "manual",
      clientType: client.clientType ?? "startup",
      suggestedTerms: Array.isArray(aiOutput.terms) ? aiOutput.terms : [],
      pricingHints: [
        urgency === "Urgent" ? "Priority processing premium (15%) applied." : "Standard turnaround."
      ],
      subtotal: typeof aiOutput.subtotal === "number" ? aiOutput.subtotal : 0,
      taxPercent: typeof aiOutput.taxPercent === "number" ? aiOutput.taxPercent : 0,
      taxAmount: typeof aiOutput.taxAmount === "number" ? aiOutput.taxAmount : 0,
      total: typeof aiOutput.total === "number" ? aiOutput.total : 0,
      validityLabel: urgency === "Urgent" ? "Valid for 3 days" : "Valid for 7 days",
      notes: typeof aiOutput.notes === "string" ? aiOutput.notes : "AI-generated quotation draft.",
      terms: Array.isArray(aiOutput.terms) ? aiOutput.terms : [],
      enhancedText: typeof aiOutput.enhancedText === "string" ? aiOutput.enhancedText : sourceText
    };
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    throw error;
  }
}
