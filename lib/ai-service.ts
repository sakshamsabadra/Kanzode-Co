import { Client, ServiceCatalogItem, SuggestedPackage } from "@/types";
import { MockQuotationDraft } from "./quotation-generator";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "minimax/minimax-m2.5:free";

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

  const systemPrompt = `You are the Senior Managing Partner at Kanzode & Co.

Goal: Convert an unstructured client request into a quotation draft.

Client type: ${client.clientType}
Standard engagement terms: ${client.standardTerms.join(", ")}

Service catalog (map ONLY to these IDs):
${serviceCatalog.map((s) => `- {"id":"${s.id || (s as any)._id}","name":"${s.name}","unitPrice":${s.unitPrice}}`).join("\n")}

Rules:
- Map requested work to closest services from catalog.
- If urgency is "Urgent", apply 15% premium on unitPrice.
- Produce professional advisory notes per line item.
- Return ONLY JSON (no markdown).

Return JSON with keys: urgency, quotationType, extractedServices, lineItems, subtotal, taxPercent, taxAmount, total, terms, notes.`;

  const userPrompt = `CLIENT REQUEST: "${sourceText}"`;

  try {
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
        max_tokens: 900,
        response_format: { type: "json_object" }
      })
    });

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

    const aiOutput = JSON.parse(content);

    return {
      ...aiOutput,
      extractedServices: aiOutput.extractedServices || [],
      lineItems: aiOutput.lineItems || [],
      quotationType: "manual",
      clientType: client.clientType,
      suggestedTerms: aiOutput.terms || [],
      pricingHints: [
        aiOutput.urgency === "Urgent" ? "Priority processing premium (15%) applied." : "Standard turnaround."
      ]
    };
  } catch (error) {
    console.error("AI Analysis Failed:", error);
    throw error;
  }
}
