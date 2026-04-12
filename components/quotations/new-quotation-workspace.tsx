"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles } from "lucide-react";
import { Client, ClientType, ServiceCatalogItem, SuggestedPackage } from "@/types";
import { Panel } from "@/components/ui/panel";
import { ActionTrigger } from "@/components/ui/action-trigger";
import { ClientSummaryCard } from "@/components/quotations/client-summary-card";
import { ExtractionPreviewCard } from "@/components/quotations/extraction-preview-card";
import { GeneratedQuotationPreview } from "@/components/quotations/generated-quotation-preview";
import {
  MockQuotationDraft,
  generateMockQuotationDraft
} from "@/lib/mock-quotation-generator";
import { saveQuotationDraft, sendSavedQuotation, convertSavedQuotationToInvoice } from "@/app/actions";

const sampleRequest =
  "Client needs private limited incorporation, GST registration, and one founders agreement draft urgently. Wants quotation by today.";

interface Props {
  initialClients: Client[];
  serviceCatalog: ServiceCatalogItem[];
  suggestedPackages: SuggestedPackage[];
}

export function NewQuotationWorkspace({
  initialClients,
  serviceCatalog,
  suggestedPackages
}: Props) {
  const [clients, setClients] = useState(initialClients);
  const [selectedClientId, setSelectedClientId] = useState(initialClients[0]?.id ?? "");
  const [requestText, setRequestText] = useState(sampleRequest);
  const [showAddClient, setShowAddClient] = useState(false);
  const [quickClient, setQuickClient] = useState({
    name: "",
    companyName: "",
    email: "",
    whatsappNumber: "",
    clientType: "startup" as ClientType
  });
  const [draft, setDraft] = useState<MockQuotationDraft | null>(() =>
    initialClients[0]
      ? generateMockQuotationDraft({
          client: initialClients[0],
          sourceText: sampleRequest,
          serviceCatalog,
          suggestedPackages
        })
      : null
  );
  const [statusMessage, setStatusMessage] = useState(
    "Mock extraction is ready with realistic sample data."
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const selectedClient =
    clients.find((client) => client.id === selectedClientId) ?? clients[0];

  function handleAddClient() {
    if (!quickClient.name || !quickClient.companyName || !quickClient.email) {
      setStatusMessage("Add at least name, company name, and email for the quick client.");
      return;
    }

    const newClient: Client = {
      id: `cl-local-${Date.now()}`,
      name: quickClient.name,
      companyName: quickClient.companyName,
      email: quickClient.email,
      whatsappNumber: quickClient.whatsappNumber || "+91 90000 00000",
      clientType: quickClient.clientType,
      pastServices: [],
      standardTerms: [
        "50% advance before work begins",
        "Final delivery upon approval and balance confirmation"
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setClients((current) => [newClient, ...current]);
    setSelectedClientId(newClient.id);
    setQuickClient({
      name: "",
      companyName: "",
      email: "",
      whatsappNumber: "",
      clientType: "startup"
    });
    setShowAddClient(false);
    setStatusMessage(`Quick client ${newClient.companyName} added for this mock session.`);
  }

  function handleGenerate() {
    if (!selectedClient) return;
    const nextDraft = generateMockQuotationDraft({
      client: selectedClient,
      sourceText: requestText,
      serviceCatalog,
      suggestedPackages
    });
    setDraft(nextDraft);
    setStatusMessage(`Quotation draft prepared for ${selectedClient.companyName}.`);
  }

  function handleRegenerate() {
    handleGenerate();
    setStatusMessage("Quotation regenerated with refreshed pricing and urgency interpretation.");
  }

  async function handleSaveDraft() {
    if (!draft || !selectedClient) return;
    setIsProcessing(true);
    setStatusMessage("Saving quotation draft...");
    try {
      const qId = await saveQuotationDraft(draft, selectedClient.id, requestText);
      setStatusMessage("Draft saved! Redirecting to preview...");
      router.push(`/quotations/${qId}`);
    } catch (e) {
      setStatusMessage("Failed to save draft.");
      setIsProcessing(false);
    }
  }

  async function handleSend() {
    if (!draft || !selectedClient) return;
    setIsProcessing(true);
    setStatusMessage("Saving and sending quotation...");
    try {
      const qId = await saveQuotationDraft(draft, selectedClient.id, requestText);
      await sendSavedQuotation(qId);
      setStatusMessage("Sent successfully! Redirecting...");
      router.push(`/quotations/${qId}`);
    } catch (e) {
      setStatusMessage("Failed to send.");
      setIsProcessing(false);
    }
  }

  async function handleConvert() {
    if (!draft || !selectedClient) return;
    setIsProcessing(true);
    setStatusMessage("Saving draft and converting to invoice...");
    try {
      const qId = await saveQuotationDraft(draft, selectedClient.id, requestText);
      const invId = await convertSavedQuotationToInvoice(qId);
      setStatusMessage("Converted to Invoice! Redirecting...");
      router.push(`/invoices/${invId}`);
    } catch (e) {
      setStatusMessage("Failed to convert.");
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      {statusMessage ? (
        <div className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm text-slate-600 shadow-[0_16px_48px_rgba(15,23,42,0.05)]">
          {statusMessage}
        </div>
      ) : null}

      <Panel
        eyebrow="Section 1"
        title="Client selection"
        description="Select an existing client, add a new one quickly, and keep the summary visible while generating the quotation."
      >
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="grid flex-1 gap-4 md:grid-cols-[1fr_auto]">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Existing client</span>
              <select
                value={selectedClientId}
                onChange={(event) => setSelectedClientId(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              >
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.companyName}
                  </option>
                ))}
              </select>
            </label>

            <div className="flex items-end">
              <ActionTrigger
                variant="secondary"
                onClick={() => setShowAddClient((current) => !current)}
                className="w-full md:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add new client quickly
              </ActionTrigger>
            </div>
          </div>
        </div>

        {showAddClient ? (
          <div className="mt-5 grid gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-5 md:grid-cols-2 xl:grid-cols-5">
            <input
              value={quickClient.name}
              onChange={(event) =>
                setQuickClient((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Contact name"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <input
              value={quickClient.companyName}
              onChange={(event) =>
                setQuickClient((current) => ({
                  ...current,
                  companyName: event.target.value
                }))
              }
              placeholder="Company name"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <input
              value={quickClient.email}
              onChange={(event) =>
                setQuickClient((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="Email"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <input
              value={quickClient.whatsappNumber}
              onChange={(event) =>
                setQuickClient((current) => ({
                  ...current,
                  whatsappNumber: event.target.value
                }))
              }
              placeholder="WhatsApp number"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <div className="flex gap-3">
              <select
                value={quickClient.clientType}
                onChange={(event) =>
                  setQuickClient((current) => ({
                    ...current,
                    clientType: event.target.value as ClientType
                  }))
                }
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
              >
                <option value="startup">Startup</option>
                <option value="sme">SME</option>
                <option value="professional_firm">Professional firm</option>
                <option value="foreign_subsidiary">Foreign subsidiary</option>
              </select>
              <ActionTrigger onClick={handleAddClient}>Save</ActionTrigger>
            </div>
          </div>
        ) : null}

        {selectedClient ? <div className="mt-5"><ClientSummaryCard client={selectedClient} /></div> : null}
      </Panel>

      <Panel
        eyebrow="Section 2"
        title="Request input"
        description="Paste the raw client message exactly as received. The mock processor will convert it into a structured quotation draft."
      >
        <textarea
          value={requestText}
          onChange={(event) => setRequestText(event.target.value)}
          className="min-h-[220px] w-full rounded-[28px] border border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-700 outline-none"
          placeholder='Client needs private limited incorporation, GST registration, and one founders agreement draft urgently. Wants quotation by today.'
        />
      </Panel>

      <Panel
        eyebrow="Section 3"
        title="AI extraction preview"
        description="Mock extraction shows how services, urgency, client fit, pricing hints, and commercial terms can be surfaced before final generation."
      >
        <ExtractionPreviewCard draft={draft} />
      </Panel>

      <Panel
        eyebrow="Section 4"
        title="Generated quotation preview"
        description="Preview the commercial structure before saving, sending, or converting to invoice."
      >
        <GeneratedQuotationPreview draft={draft} />
      </Panel>

      <Panel
        eyebrow="Section 5"
        title="Actions"
        description="These actions use mock processing today and can later be wired to real API routes, OpenAI extraction, and billing workflows."
      >
        <div className="flex flex-wrap gap-3">
          <ActionTrigger onClick={handleGenerate} disabled={isProcessing}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate quotation
          </ActionTrigger>
          <ActionTrigger variant="secondary" onClick={handleRegenerate} disabled={isProcessing}>
            Regenerate
          </ActionTrigger>
          <ActionTrigger variant="secondary" onClick={handleSaveDraft} disabled={isProcessing}>
            Save draft
          </ActionTrigger>
          <ActionTrigger variant="secondary" onClick={handleSend} disabled={isProcessing}>
            Send
          </ActionTrigger>
          <ActionTrigger variant="ghost" onClick={handleConvert} disabled={isProcessing}>
            Convert to invoice
          </ActionTrigger>
        </div>
      </Panel>
    </div>
  );
}
