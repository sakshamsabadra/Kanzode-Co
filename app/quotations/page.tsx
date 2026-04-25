import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { Panel } from "@/components/ui/panel";
import * as dataService from "@/lib/data-service";
import { SearchableQuotationList } from "@/components/quotations/searchable-quotation-list";

export default async function QuotationsPage() {
  let quotations: any[] = [];
  let clients: any[] = [];

  try {
    quotations = await dataService.getQuotations();
    clients = await dataService.getClients();
  } catch (error) {
    console.error("Failed to load quotations:", error);
  }

  const normalizedQuotations = JSON.parse(JSON.stringify(quotations));
  const normalizedClients = JSON.parse(JSON.stringify(clients));

  return (
    <AppShell
      title="Quotations"
      description="Manage your sales pipeline, track approvals, and convert drafts to invoices."
      actions={<ActionButton href="/quotations/new">New quotation</ActionButton>}
    >
      <Panel
        eyebrow="Pipeline Management"
        title="Quotation Directory"
        description="Search, filter, edit, or delete your client proposals."
      >
        <SearchableQuotationList 
          quotations={normalizedQuotations} 
          clients={normalizedClients} 
        />
      </Panel>
    </AppShell>
  );
}
