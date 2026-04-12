"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { DataTable } from "@/components/ui/data-table";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { getClients, getParties, createParty, deleteParty } from "@/lib/mock-storage";
import { formatCurrency } from "@/lib/format";
import { Plus, Trash2 } from "lucide-react";

export default function ClientsPage() {
  const [clients] = useState(getClients());
  const [parties, setParties] = useState(getParties());
  const [showAddParty, setShowAddParty] = useState(false);
  const [newParty, setNewParty] = useState({ name: "", address: "", email: "", phoneNumber: "" });

  const clientRows = clients.map((client) => ({
    ...client,
    relationshipStatus: client.pastServices.length > 0 ? "active" : "prospect"
  }));

  function handleAddParty() {
    if (!newParty.name || !newParty.email) return;
    createParty({
      name: newParty.name,
      address: newParty.address,
      email: newParty.email,
      phoneNumber: newParty.phoneNumber
    });
    setNewParty({ name: "", address: "", email: "", phoneNumber: "" });
    setShowAddParty(false);
    setParties(getParties());
  }

  function handleDeleteParty(id: string) {
    deleteParty(id);
    setParties(getParties());
  }

  return (
    <AppShell
      title="Clients"
      description="Client memory, parties, lifecycle stage, package fit, and commercial history."
      actions={
        <ActionButton href="/quotations/new">Create quotation</ActionButton>
      }
    >
      <Panel
        eyebrow="Directory"
        title="Client master"
        description="Client records with service history and relationship context."
      >
        <DataTable
          columns={[
            { key: "companyName", title: "Client" },
            { key: "name", title: "Contact" },
            { key: "clientType", title: "Type" },
            { key: "email", title: "Email" },
            {
              key: "pricingPreferences",
              title: "Pricing anchor",
              align: "right",
              render: (value) => (
                <span className="font-semibold text-slate-900">
                  {formatCurrency(
                    Number(
                      (value as { anchorAmount?: number } | undefined)?.anchorAmount ?? 0
                    )
                  )}
                </span>
              )
            },
            {
              key: "relationshipStatus",
              title: "Status",
              render: (value) => <StatusBadge status={String(value)} />
            }
          ]}
          rows={clientRows}
        />
      </Panel>

      <Panel
        eyebrow="Parties"
        title="Party directory"
        description="Parties associated with quotations and invoices (name, address, email, phone)."
      >
        <div className="mb-4">
          <ActionButton onClick={() => setShowAddParty(!showAddParty)} variant={showAddParty ? "ghost" : "secondary"}>
            <Plus className="mr-2 h-4 w-4" />
            {showAddParty ? "Cancel" : "Add party"}
          </ActionButton>
        </div>

        {showAddParty && (
          <div className="mb-6 grid gap-4 rounded-2xl border border-blue-200 bg-brand-50/50 p-5 md:grid-cols-5">
            <input
              value={newParty.name}
              onChange={(e) => setNewParty((c) => ({ ...c, name: e.target.value }))}
              placeholder="Name"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <input
              value={newParty.address}
              onChange={(e) => setNewParty((c) => ({ ...c, address: e.target.value }))}
              placeholder="Address"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <input
              value={newParty.email}
              onChange={(e) => setNewParty((c) => ({ ...c, email: e.target.value }))}
              placeholder="Email"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <input
              value={newParty.phoneNumber}
              onChange={(e) => setNewParty((c) => ({ ...c, phoneNumber: e.target.value }))}
              placeholder="Phone number"
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <ActionButton onClick={handleAddParty} variant="primary">Save</ActionButton>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[1fr_1fr_1fr_0.7fr_auto] border-b border-slate-200 bg-brand-50 px-5 py-4 text-xs uppercase tracking-[0.22em] text-brand-800">
            <div>Name</div>
            <div>Address</div>
            <div>Email</div>
            <div>Phone</div>
            <div></div>
          </div>
          {parties.map((party) => (
            <div key={party.id} className="grid grid-cols-[1fr_1fr_1fr_0.7fr_auto] items-center border-b border-slate-100 px-5 py-4 last:border-b-0">
              <div className="font-medium text-slate-900">{party.name}</div>
              <div className="text-sm text-slate-600">{party.address}</div>
              <div className="text-sm text-slate-600">{party.email}</div>
              <div className="text-sm text-slate-600">{party.phoneNumber}</div>
              <button onClick={() => handleDeleteParty(party.id)} className="rounded-full p-2 text-red-500 hover:bg-red-50" title="Remove"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
          {parties.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-slate-500">No parties yet.</div>
          )}
        </div>
      </Panel>
    </AppShell>
  );
}
