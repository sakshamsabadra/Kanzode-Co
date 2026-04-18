"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, ArrowLeft, Plus, Trash2 } from "lucide-react";
import { Client, ServiceCatalogItem, SuggestedPackage } from "@/types";
import { Panel } from "@/components/ui/panel";
import { GeneratedQuotationPreview } from "@/components/quotations/generated-quotation-preview";
import { updateQuotationAction } from "@/app/actions";
import { toast } from "react-hot-toast";

interface Props {
  initialQuotation: any;
  clients: Client[];
  serviceCatalog: ServiceCatalogItem[];
  suggestedPackages: SuggestedPackage[];
}

export function EditQuotationWorkspace({
  initialQuotation,
  clients,
  serviceCatalog,
  suggestedPackages
}: Props) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  
  // Local state for editing
  const [quotation, setQuotation] = useState({
    ...initialQuotation,
    lineItems: [...initialQuotation.lineItems]
  });

  const handleUpdateField = (field: string, value: any) => {
    setQuotation((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleUpdateLineItem = (index: number, field: string, value: any) => {
    const newList = [...quotation.lineItems];
    const item = { ...newList[index], [field]: value };
    
    // Recalculate amount if qty or price changed
    if (field === "quantity" || field === "unitPrice") {
      item.amount = Number(item.quantity) * Number(item.unitPrice);
    }
    
    newList[index] = item;
    
    // Recalculate totals
    const subtotal = newList.reduce((sum: number, i: any) => sum + i.amount, 0);
    const total = subtotal; // Assuming no tax as per quotation-generator logic

    setQuotation((prev: any) => ({ 
      ...prev, 
      lineItems: newList,
      subtotal,
      total
    }));
  };

  const handleRemoveLineItem = (index: number) => {
    const newList = quotation.lineItems.filter((_: any, i: number) => i !== index);
    const subtotal = newList.reduce((sum: number, i: any) => sum + i.amount, 0);
    setQuotation((prev: any) => ({ 
      ...prev, 
      lineItems: newList,
      subtotal,
      total: subtotal
    }));
  };

  const handleAddLineItem = () => {
    const firstService = serviceCatalog[0];
    setQuotation((prev: any) => ({
      ...prev,
      lineItems: [
        ...prev.lineItems,
        {
          id: `new-${Date.now()}`,
          title: firstService.name,
          serviceCatalogItemId: firstService.id || (firstService as any)._id,
          quantity: 1,
          unitPrice: firstService.unitPrice,
          amount: firstService.unitPrice
        }
      ]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    toast.loading("Saving changes...", { id: "save" });
    try {
      await updateQuotationAction(initialQuotation.id, quotation);
      toast.success("Quotation updated!", { id: "save" });
      router.push(`/quotations/${initialQuotation.id}`);
    } catch (e) {
      toast.error("Failed to save.", { id: "save" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <section className="space-y-6">
        <Panel
          eyebrow="Configuration"
          title="Edit Details"
          description="Adjust document numbers, meta information, and commercial terms."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Quotation #</label>
              <input 
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-brand-500"
                value={quotation.quotationNumber}
                onChange={(e) => handleUpdateField("quotationNumber", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Challan #</label>
              <input 
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-brand-500"
                value={quotation.challanNumber}
                onChange={(e) => handleUpdateField("challanNumber", e.target.value)}
              />
            </div>
          </div>
        </Panel>

        <Panel
          eyebrow="Commercials"
          title="Line Items"
          description="Manage services, quantities, and pricing."
        >
          <div className="space-y-4">
            {quotation.lineItems.map((item: any, idx: number) => (
              <div key={item.id || `item-${idx}`} className="grid grid-cols-[1fr_80px_100px_40px] items-center gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
                <input 
                  className="rounded-lg border border-slate-200 p-2 text-sm"
                  value={item.title}
                  onChange={(e) => handleUpdateLineItem(idx, "title", e.target.value)}
                  placeholder="Service Title"
                />
                <input 
                  type="number"
                  className="rounded-lg border border-slate-200 p-2 text-sm"
                  value={item.quantity}
                  onChange={(e) => handleUpdateLineItem(idx, "quantity", e.target.value)}
                  placeholder="Qty"
                />
                <input 
                  type="number"
                  className="rounded-lg border border-slate-200 p-2 text-sm"
                  value={item.unitPrice}
                  onChange={(e) => handleUpdateLineItem(idx, "unitPrice", e.target.value)}
                  placeholder="Price"
                />
                <button 
                  onClick={() => handleRemoveLineItem(idx)}
                  className="flex h-8 w-8 items-center justify-center text-red-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            <button
              onClick={handleAddLineItem}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-sm font-medium text-slate-600 hover:border-brand-300 hover:text-brand-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add line item
            </button>
          </div>
        </Panel>

        <Panel
          eyebrow="Advisory"
          title="Terms & Notes"
          description="Finalize the commercial conditions and internal notes."
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Internal Notes</label>
              <textarea 
                className="w-full min-h-[100px] rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-brand-500"
                value={quotation.notes}
                onChange={(e) => handleUpdateField("notes", e.target.value)}
              />
            </div>
            <div className="flex gap-4">
               <button
                 onClick={handleSave}
                 disabled={isSaving}
                 className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-600 px-8 py-4 text-sm font-bold text-white shadow-lg hover:bg-brand-700 transition active:scale-95 disabled:opacity-50"
               >
                 <Save className="h-4 w-4" />
                 Update Quotation
               </button>
            </div>
          </div>
        </Panel>
      </section>

      <section className="relative">
        <div className="sticky top-8 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Live Preview</p>
            <span className="rounded-full bg-brand-50 px-3 py-1 text-[10px] font-bold uppercase text-brand-600">Syncing...</span>
          </div>
          <div className="overflow-hidden rounded-[40px] border border-slate-200 bg-white shadow-2xl">
            <GeneratedQuotationPreview 
              draft={{
                ...quotation,
                extractedServices: [],
                urgency: "Standard",
                clientType: "startup",
                quotationType: "manual",
                pricingHints: [],
                taxPercent: quotation.taxPercent || 0,
                taxAmount: quotation.taxAmount || 0,
                validityLabel: "Valid for 7 days",
                terms: quotation.terms || []
              }}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
