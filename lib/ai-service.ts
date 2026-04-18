import { Client, ServiceCatalogItem, SuggestedPackage } from "@/types";
import { MockQuotationDraft } from "./quotation-generator";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = "nvidia/nemotron-3-super-120b-a12b:free";

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

  const systemPrompt = `
    You are the Senior Managing Partner at Kanzode & Co., a premium business advisory firm. 
    Your tone is ultra-professional, encouraging, and commercially astute.

    OBJECTIVE:
    Analyze a client's unstructured request and transform it into a high-fidelity commercial quotation.

    CLIENT CONTEXT:
    - Entity Type: ${client.clientType}
    - Standard Engagement Terms: ${client.standardTerms.join(", ")}
    
    SERVICE CATALOG (You must map requests ONLY to these IDs):
    ${serviceCatalog.map(s => `- [ID: ${s.id || (s as any)._id}] ${s.name} (Base Rate: ₹${s.unitPrice})`).join("\n")}

    EXTRACTION RULES:
    1. STRICT MAPPING: Map the request to the closest matching Service IDs from the catalog.
    2. PROFESSIONAL NOTES: Write clear, advisory-style notes. Instead of "We will do GST", write "Comprehensive GST registration and compliance setup to ensure your business is fully regulated from day one."
    3. PRICING STRATEGY: 
       - If "Standard", use catalog rates.
       - If "Urgent", apply a 15% professional premium to the unit price.
    4. TERMS: Include 3-4 professional commercial terms (e.g., "50% advance required", "Validity: 7 days").
    
    OUTPUT FORMAT:
    You MUST return ONLY a valid JSON object. No markdown, no prose before or after.
  `;

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

    let content = data.choices[0].message.content;

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
