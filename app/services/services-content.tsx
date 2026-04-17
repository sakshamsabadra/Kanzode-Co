"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { Panel } from "@/components/ui/panel";
import { formatCurrency } from "@/lib/format";
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, Copy, Check, X } from "lucide-react";
import { addServiceAction, updateServiceAction, deleteServiceAction } from "@/app/actions";

export default function ServicesContent({ initialServices }: { initialServices: any[] }) {
  const [services, setServices] = useState(initialServices);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "",
    unitPrice: 0,
    billingModel: "one_time" as "one_time" | "monthly",
    defaultTaxPercent: 18,
    tags: ""
  });
  const [editItem, setEditItem] = useState<any>({});

  const servicesRows = services.map(s => ({...s, id: s.id || s._id.toString()}));

  async function handleAdd() {
    if (!newItem.name || !newItem.category) return;
    await addServiceAction({
      ...newItem,
      tags: newItem.tags.split(",").map((t) => t.trim()).filter(Boolean)
    });
    window.location.reload();
  }

  async function handleDelete(id: string) {
    await deleteServiceAction(id);
    window.location.reload();
  }

  function startEdit(item: any) {
    setEditingId(item.id);
    setEditItem({ ...item });
  }

  async function saveEdit() {
    if (!editingId) return;
    await updateServiceAction(editingId, editItem);
    setEditingId(null);
    window.location.reload();
  }

  return (
    <AppShell
      title="Services"
      description="Manage your firm's service catalog. Add, edit, remove, reorder, and copy services for use in quotations and invoices."
      actions={<ActionButton href="/quotations/new">Create quotation</ActionButton>}
    >
      <Panel
        eyebrow="Catalog"
        title="Service items"
        description="Services provided by the firm. Use these in quotation and invoice templates."
      >
        <div className="flex gap-3 mb-4">
          <ActionButton onClick={() => setShowAdd(!showAdd)} variant={showAdd ? "ghost" : "primary"}>
            <Plus className="mr-2 h-4 w-4" />
            {showAdd ? "Cancel" : "Add service"}
          </ActionButton>
        </div>

        {showAdd && (
          <div className="mb-6 grid gap-4 rounded-2xl border border-blue-200 bg-brand-50/50 p-5 md:grid-cols-3 xl:grid-cols-6">
            <input
              value={newItem.name}
              onChange={(e) => setNewItem((c) => ({ ...c, name: e.target.value }))}
              placeholder="Service name"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <input
              value={newItem.category}
              onChange={(e) => setNewItem((c) => ({ ...c, category: e.target.value }))}
              placeholder="Category"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <input
              type="number"
              value={newItem.unitPrice || ""}
              onChange={(e) => setNewItem((c) => ({ ...c, unitPrice: Number(e.target.value) }))}
              placeholder="Unit price"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <select
              value={newItem.billingModel}
              onChange={(e) => setNewItem((c) => ({ ...c, billingModel: e.target.value as "one_time" | "monthly" }))}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            >
              <option value="one_time">One time</option>
              <option value="monthly">Monthly</option>
            </select>
            <input
              value={newItem.tags}
              onChange={(e) => setNewItem((c) => ({ ...c, tags: e.target.value }))}
              placeholder="Tags (comma separated)"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <ActionButton onClick={handleAdd} variant="primary">Save</ActionButton>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[1fr_0.5fr_0.5fr_0.5fr_auto] border-b border-slate-200 bg-brand-50 px-5 py-4 text-xs uppercase tracking-[0.22em] text-brand-800">
            <div>Name</div>
            <div>Category</div>
            <div className="text-right">Price</div>
            <div className="text-right">Model</div>
            <div>Actions</div>
          </div>

          {servicesRows.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_0.5fr_0.5fr_0.5fr_auto] items-center border-b border-slate-100 px-5 py-4 last:border-b-0"
            >
              {editingId === item.id ? (
                <>
                  <input
                    value={editItem.name || ""}
                    onChange={(e) => setEditItem((c: any) => ({ ...c, name: e.target.value }))}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none"
                  />
                  <input
                    value={editItem.category || ""}
                    onChange={(e) => setEditItem((c: any) => ({ ...c, category: e.target.value }))}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none"
                  />
                  <input
                    type="number"
                    value={editItem.unitPrice || ""}
                    onChange={(e) => setEditItem((c: any) => ({ ...c, unitPrice: Number(e.target.value) }))}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm text-right outline-none"
                  />
                  <select
                    value={editItem.billingModel || "one_time"}
                    onChange={(e) => setEditItem((c: any) => ({ ...c, billingModel: e.target.value as "one_time" | "monthly" }))}
                    className="rounded-2xl border border-slate-200 px-3 py-2 text-sm outline-none"
                  >
                    <option value="one_time">One time</option>
                    <option value="monthly">Monthly</option>
                  </select>
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="rounded-full p-2 text-brand-600 hover:bg-brand-50"><Check className="h-4 w-4" /></button>
                    <button onClick={() => setEditingId(null)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button>
                  </div>
                </>
              ) : (
                <>
                  <div className="font-medium text-slate-900">{item.name}</div>
                  <div className="text-sm text-slate-600">{item.category}</div>
                  <div className="text-right text-sm font-semibold text-slate-900">{formatCurrency(item.unitPrice)}</div>
                  <div className="text-right text-sm text-slate-600">{item.billingModel === "one_time" ? "One time" : "Monthly"}</div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(item)} className="rounded-full p-2 text-brand-600 hover:bg-brand-50" title="Edit"><Pencil className="h-4 w-4" /></button>
                    <button onClick={() => handleDelete(item.id)} className="rounded-full p-2 text-red-500 hover:bg-red-50" title="Remove"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
