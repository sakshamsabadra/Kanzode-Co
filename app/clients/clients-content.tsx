"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/format";
import { Plus, Trash2, Pencil, X, Check } from "lucide-react";
import {
  createPartyAction,
  deletePartyAction,
  deleteClientAction,
  createClientAction,
} from "@/app/actions";

export default function ClientsContent({
  initialClients,
  initialParties,
}: {
  initialClients: any[];
  initialParties: any[];
}) {
  const [parties, setParties] = useState(initialParties);
  const [clients, setClients] = useState(initialClients);
  const [showAddParty, setShowAddParty] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [confirmDeleteClient, setConfirmDeleteClient] = useState<string | null>(null);
  const [confirmDeleteParty, setConfirmDeleteParty] = useState<string | null>(null);

  const [newParty, setNewParty] = useState({
    name: "",
    address: "",
    email: "",
    phoneNumber: "",
  });

  const [newClient, setNewClient] = useState({
    name: "",
    companyName: "",
    email: "",
    whatsappNumber: "",
    clientType: "sme",
    address: "",
  });

  // Normalise IDs (already done server-side, but just in case)
  const clientRows = clients.map((client) => ({
    ...client,
    id: client.id || client._id?.toString(),
    relationshipStatus: client.pastServices?.length > 0 ? "active" : "prospect",
  }));

  const partiesRows = parties.map((p) => ({
    ...p,
    id: p.id || p._id?.toString(),
  }));

  async function handleAddParty() {
    if (!newParty.name || !newParty.email) return;
    await createPartyAction(newParty);
    setNewParty({ name: "", address: "", email: "", phoneNumber: "" });
    setShowAddParty(false);
    window.location.reload();
  }

  async function handleDeleteParty(id: string) {
    await deletePartyAction(id);
    setConfirmDeleteParty(null);
    window.location.reload();
  }

  async function handleAddClient() {
    if (!newClient.name || !newClient.companyName || !newClient.email) return;
    await createClientAction(newClient);
    setNewClient({
      name: "",
      companyName: "",
      email: "",
      whatsappNumber: "",
      clientType: "sme",
      address: "",
    });
    setShowAddClient(false);
    window.location.reload();
  }

  async function handleDeleteClient(id: string) {
    await deleteClientAction(id);
    setConfirmDeleteClient(null);
    window.location.reload();
  }

  return (
    <AppShell
      title="Clients"
      description="Client memory, parties, lifecycle stage, package fit, and commercial history."
      actions={
        <div className="flex gap-3 no-print">
          <ActionButton
            onClick={() => setShowAddClient(!showAddClient)}
            variant={showAddClient ? "ghost" : "secondary"}
          >
            <Plus className="mr-2 h-4 w-4" />
            {showAddClient ? "Cancel" : "Add client"}
          </ActionButton>
          <ActionButton href="/quotations/new">Create quotation</ActionButton>
        </div>
      }
    >
      {/* ── Add Client Form ── */}
      {showAddClient && (
        <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50/50 p-5">
          <p className="mb-4 text-sm font-semibold text-slate-700">New client</p>
          <div className="grid gap-3 md:grid-cols-3">
            <input
              value={newClient.companyName}
              onChange={(e) => setNewClient((c) => ({ ...c, companyName: e.target.value }))}
              placeholder="Company name *"
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
            <input
              value={newClient.name}
              onChange={(e) => setNewClient((c) => ({ ...c, name: e.target.value }))}
              placeholder="Contact name *"
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
            <input
              value={newClient.email}
              onChange={(e) => setNewClient((c) => ({ ...c, email: e.target.value }))}
              placeholder="Email *"
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
            <input
              value={newClient.whatsappNumber}
              onChange={(e) => setNewClient((c) => ({ ...c, whatsappNumber: e.target.value }))}
              placeholder="WhatsApp number"
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
            <input
              value={newClient.address}
              onChange={(e) => setNewClient((c) => ({ ...c, address: e.target.value }))}
              placeholder="Address"
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            />
            <select
              value={newClient.clientType}
              onChange={(e) => setNewClient((c) => ({ ...c, clientType: e.target.value }))}
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
            >
              <option value="startup">Startup</option>
              <option value="sme">SME</option>
              <option value="professional_firm">Professional Firm</option>
              <option value="foreign_subsidiary">Foreign Subsidiary</option>
            </select>
          </div>
          <div className="mt-4 flex gap-3">
            <ActionButton onClick={handleAddClient} variant="primary">
              <Check className="mr-2 h-4 w-4" />
              Save client
            </ActionButton>
            <ActionButton onClick={() => setShowAddClient(false)} variant="ghost">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </ActionButton>
          </div>
        </div>
      )}

      {/* ── Client Master Table ── */}
      <Panel
        eyebrow="Directory"
        title="Client master"
        description="Client records with service history and relationship context."
      >
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* Header */}
          <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_0.8fr_auto] border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs uppercase tracking-[0.22em] text-slate-500">
            <div>Company</div>
            <div>Contact</div>
            <div>Type</div>
            <div>Email</div>
            <div>Status</div>
            <div></div>
          </div>

          {clientRows.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-slate-500">
              No clients yet. Click &ldquo;Add client&rdquo; to get started.
            </div>
          )}

          {clientRows.map((client) => (
            <div
              key={client.id}
              className="grid grid-cols-[1.5fr_1fr_1fr_1fr_0.8fr_auto] items-center border-b border-slate-100 px-5 py-4 last:border-b-0"
            >
              <div className="font-semibold text-slate-900">{client.companyName}</div>
              <div className="text-sm text-slate-700">{client.name}</div>
              <div className="text-sm text-slate-600 capitalize">{client.clientType?.replace("_", " ")}</div>
              <div className="truncate text-sm text-slate-600">{client.email}</div>
              <div>
                <StatusBadge status={client.relationshipStatus} />
              </div>
              {/* Actions */}
              <div className="flex items-center gap-1">
                {confirmDeleteClient === client.id ? (
                  <>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="rounded-md px-2 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700"
                      title="Confirm delete"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteClient(null)}
                      className="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setConfirmDeleteClient(client.id)}
                      className="rounded-full p-2 text-red-400 hover:bg-red-50 hover:text-red-600"
                      title="Delete client"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* ── Party Directory ── */}
      <Panel
        eyebrow="Parties"
        title="Party directory"
        description="Parties associated with quotations and invoices (name, address, email, phone)."
      >
        <div className="mb-4">
          <ActionButton
            onClick={() => setShowAddParty(!showAddParty)}
            variant={showAddParty ? "ghost" : "secondary"}
          >
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
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <input
              value={newParty.address}
              onChange={(e) => setNewParty((c) => ({ ...c, address: e.target.value }))}
              placeholder="Address"
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <input
              value={newParty.email}
              onChange={(e) => setNewParty((c) => ({ ...c, email: e.target.value }))}
              placeholder="Email"
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <input
              value={newParty.phoneNumber}
              onChange={(e) =>
                setNewParty((c) => ({ ...c, phoneNumber: e.target.value }))
              }
              placeholder="Phone number"
              className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none"
            />
            <ActionButton onClick={handleAddParty} variant="primary">
              Save
            </ActionButton>
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="grid grid-cols-[1fr_1fr_1fr_0.7fr_auto] border-b border-slate-200 bg-slate-50 px-5 py-4 text-xs uppercase tracking-[0.22em] text-slate-500">
            <div>Name</div>
            <div>Address</div>
            <div>Email</div>
            <div>Phone</div>
            <div></div>
          </div>
          {partiesRows.map((party) => (
            <div
              key={party.id}
              className="grid grid-cols-[1fr_1fr_1fr_0.7fr_auto] items-center border-b border-slate-100 px-5 py-4 last:border-b-0"
            >
              <div className="font-medium text-slate-900">{party.name}</div>
              <div className="text-sm text-slate-600">{party.address}</div>
              <div className="text-sm text-slate-600">{party.email}</div>
              <div className="text-sm text-slate-600">{party.phoneNumber}</div>
              <div className="flex items-center gap-1">
                {confirmDeleteParty === party.id ? (
                  <>
                    <button
                      onClick={() => handleDeleteParty(party.id)}
                      className="rounded-md px-2 py-1 text-xs font-semibold text-white bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setConfirmDeleteParty(null)}
                      className="rounded-md px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteParty(party.id)}
                    className="rounded-full p-2 text-red-400 hover:bg-red-50 hover:text-red-600"
                    title="Remove party"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {partiesRows.length === 0 && (
            <div className="px-5 py-10 text-center text-sm text-slate-500">
              No parties yet.
            </div>
          )}
        </div>
      </Panel>
    </AppShell>
  );
}
