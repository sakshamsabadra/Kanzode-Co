"use client";

import { useEffect, useState } from "react";
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
} from "@/lib/quotation-generator";
import { saveQuotationDraft, sendSavedQuotation, convertSavedQuotationToInvoice, createClientAction } from "@/app/actions";
import { toast } from "react-hot-toast";

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
  const mappedClients = initialClients.map((c: any) => ({ ...c, id: c.id || c._id.toString() }));
  const mappedServices = serviceCatalog.map((s: any) => ({ ...s, id: s.id || s._id.toString() }));
  const mappedPackages = suggestedPackages.map((p: any) => ({ ...p, id: p.id || p._id.toString() }));

  const [clients, setClients] = useState(mappedClients);
  const [selectedClientId, setSelectedClientId] = useState(mappedClients[0]?.id ?? "");
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
          serviceCatalog: mappedServices,
          suggestedPackages: mappedPackages
        })
      : null
  );
  const [statusMessage, setStatusMessage] = useState(
    "Select a client and enter a request to generate a quotation."
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (clients.length === 0) {
      setSelectedClientId("");
      return;
    }

    setSelectedClientId((current: string) => {
      if (current && clients.some((c) => c.id === current)) return current;
      return clients[0].id;
    });
  }, [clients]);

  // Patch any subset of draft fields (keeps existing fields intact)
  function patchDraft(patch: Partial<MockQuotationDraft>) {
    setDraft((prev) => (prev ? { ...prev, ...patch } : prev));
  }

  const selectedClient =
    clients.find((client) => client.id === selectedClientId) ?? clients[0];

  async function handleAddClient() {
    if (!quickClient.name || !quickClient.companyName || !quickClient.email) {
      setStatusMessage("Add at least name, company name, and email for the client.");
      return;
    }

    try {
      const saved: any = await createClientAction({
        name: quickClient.name,
        companyName: quickClient.companyName,
        email: quickClient.email,
        whatsappNumber: quickClient.whatsappNumber || "+91 9970056589",
        clientType: quickClient.clientType,
        pastServices: [],
        standardTerms: [
          "50% advance before work begins",
          "Final delivery upon approval and balance confirmation"
        ]
      });

      const newClient = { ...saved, id: saved.id || saved._id?.toString() };
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
      setStatusMessage(`Client ${newClient.companyName} added successfully.`);
    } catch (e) {
      setStatusMessage("Failed to add client. Please try again.");
    }
  }

  useEffect(() => {
    if (!selectedClient) return;

    setIsProcessing(true);
    const timer = setTimeout(() => {
      try {
        const nextDraft = generateMockQuotationDraft({
          client: selectedClient,
          sourceText: requestText,
          serviceCatalog: mappedServices,
          suggestedPackages: mappedPackages,
          quotationType: draft?.quotationType ?? "manual"
        });

        setDraft((prev) => {
          if (!prev) return nextDraft;
          return {
            ...nextDraft,
            challanNumber: prev.challanNumber,
            challanAmount: prev.challanAmount
          };
        });

        setStatusMessage(`Quotation draft prepared for ${selectedClient.companyName}.`);
      } finally {
        setIsProcessing(false);
      }
    }, 400);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedClientId, requestText]);

  async function handleSaveDraft() {
    if (!draft || !selectedClient) return;
    setIsProcessing(true);
    toast.loading("Saving quotation draft...", { id: "draft" });
    try {
      const qId = await saveQuotationDraft(draft, selectedClient.id, requestText);
      toast.success("Draft saved!", { id: "draft" });
      router.push(`/quotations/${qId}`);
    } catch (e) {
      toast.error("Failed to save draft.", { id: "draft" });
      setIsProcessing(false);
    }
  }

  async function handleSend() {
    if (!draft || !selectedClient) return;
    setIsProcessing(true);
    toast.loading("Sending quotation...", { id: "send" });
    try {
      const qId = await saveQuotationDraft(draft, selectedClient.id, requestText);
      await sendSavedQuotation(qId);
      toast.success("Sent successfully!", { id: "send" });
      router.push(`/quotations/${qId}`);
    } catch (e) {
      toast.error("Failed to send.", { id: "send" });
      setIsProcessing(false);
    }
  }

  async function handleConvert() {
    if (!draft || !selectedClient) return;
    setIsProcessing(true);
    toast.loading("Converting to invoice...", { id: "convert" });
    try {
      const qId = await saveQuotationDraft(draft, selectedClient.id, requestText);
      const invId = await convertSavedQuotationToInvoice(qId);
      toast.success("Converted to Invoice!", { id: "convert" });
      router.push(`/invoices/${invId}`);
    } catch (e) {
      toast.error("Failed to convert.", { id: "convert" });
      setIsProcessing(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Workflow Explanation Header */}
      <div className="rounded-[28px] border border-blue-100 bg-blue-50/30 p-6 shadow-sm">
        <h3 className="flex items-center gap-2 text-lg font-bold text-blue-900">
          <Sparkles className="h-5 w-5 text-blue-600" />
          AI Quotation Workflow
        </h3>
        <div className="mt-4 grid gap-6 md:grid-cols-4">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-500">1. Select Client</p>
            <p className="text-sm text-slate-600">Sets pricing anchors and default terms.</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-500">2. Input Request</p>
            <p className="text-sm text-slate-600">Paste raw intent from WhatsApp/Email.</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-500">3. Extract & Review</p>
            <p className="text-sm text-slate-600">System detects services and detects urgency.</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-500">4. Finalize</p>
            <p className="text-sm text-slate-600">Save as draft, send, or convert to invoice.</p>
          </div>
        </div>
      </div>

      {statusMessage ? (
        <div className="rounded-full border border-blue-100 bg-white px-5 py-3 text-sm text-blue-700 shadow-[0_16px_48px_rgba(37,99,235,0.05)] flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
          {statusMessage}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        {/* Left Column: Input & Context */}
        <div className="space-y-6">
          <Panel
            eyebrow="Phase 1"
            title="Source & Context"
            description="Identify the client and paste their raw request message."
          >
            <div className="space-y-4">
              <div className="flex flex-col gap-4">
                <label className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Client Selection</span>
                  <div className="flex gap-2">
                    <select
                      value={selectedClientId}
                      onChange={(event) => setSelectedClientId(event.target.value)}
                      disabled={clients.length === 0}
                      className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-60"
                    >
                      {clients.length === 0 ? (
                        <option value="">No clients loaded</option>
                      ) : (
                        clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.companyName}
                          </option>
                        ))
                      )}
                    </select>
                    <ActionTrigger
                      variant="secondary"
                      onClick={() => setShowAddClient((current) => !current)}
                      className="whitespace-nowrap"
                    >
                      <Plus className="h-4 w-4" />
                    </ActionTrigger>
                  </div>
                </label>
              </div>

              {showAddClient ? (
                <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <input
                    value={quickClient.name}
                    onChange={(event) =>
                      setQuickClient((current) => ({ ...current, name: event.target.value }))
                    }
                    placeholder="Contact name"
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none"
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
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      value={quickClient.email}
                      onChange={(event) =>
                        setQuickClient((current) => ({ ...current, email: event.target.value }))
                      }
                      placeholder="Email"
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none"
                    />
                    <select
                      value={quickClient.clientType}
                      onChange={(event) =>
                        setQuickClient((current) => ({
                          ...current,
                          clientType: event.target.value as ClientType
                        }))
                      }
                      className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none"
                    >
                      <option value="startup">Startup</option>
                      <option value="sme">SME</option>
                      <option value="professional_firm">Firm</option>
                    </select>
                  </div>
                  <ActionTrigger onClick={handleAddClient} className="w-full">Save Client</ActionTrigger>
                </div>
              ) : null}

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Raw Intent</span>
                <textarea
                  value={requestText}
                  onChange={(event) => setRequestText(event.target.value)}
                  className="min-h-[180px] w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm leading-6 text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder='Client needs private limited incorporation, GST registration, and founders agreement...'
                />
              </div>
            </div>
          </Panel>

          {selectedClient ? <ClientSummaryCard client={selectedClient} /> : null}
        </div>

        {/* Right Column: AI Processing & Review */}
        <div className="space-y-6">
          <Panel
            eyebrow="Phase 2"
            title="Analysis & Results"
            description="Review what the system has extracted and the final draft structure."
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">1. Intelligence Preview</span>
                <ExtractionPreviewCard draft={draft} onChange={patchDraft} />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400">2. Commercial Structure</span>
                <GeneratedQuotationPreview draft={draft} onChange={patchDraft} serviceCatalog={mappedServices} />
              </div>
            </div>
          </Panel>

          <Panel
            eyebrow="Finalize"
            title="Execution Actions"
            description="Take the final step to commit this quotation."
          >
            <div className="flex flex-wrap gap-3">
              <ActionTrigger variant="secondary" onClick={handleSaveDraft} disabled={isProcessing || !draft}>
                Save as Draft
              </ActionTrigger>
              <ActionTrigger variant="secondary" onClick={handleSend} disabled={isProcessing || !draft}>
                Send to Portal
              </ActionTrigger>
              <ActionTrigger variant="ghost" onClick={handleConvert} disabled={isProcessing || !draft}>
                Convert to Invoice
              </ActionTrigger>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
