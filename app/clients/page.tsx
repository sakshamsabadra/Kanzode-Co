import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { DataTable } from "@/components/ui/data-table";
import { Panel } from "@/components/ui/panel";
import { StatusBadge } from "@/components/ui/status-badge";
import { getClients } from "@/lib/mock-storage";
import { formatCurrency } from "@/lib/format";

export default function ClientsPage() {
  const clients = getClients();
  const clientRows = clients.map((client) => ({
    ...client,
    relationshipStatus: client.pastServices.length > 0 ? "active" : "prospect"
  }));

  return (
    <AppShell
      title="Clients"
      description="Client memory, lifecycle stage, package fit, and commercial history in one place."
      actions={
        <ActionButton href="/quotations/new">Create quotation</ActionButton>
      }
    >
      <Panel
        eyebrow="Directory"
        title="Client master"
        description="Mock client records with service history and relationship context."
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
    </AppShell>
  );
}
