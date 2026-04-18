import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { Panel } from "@/components/ui/panel";
import * as dataService from "@/lib/data-service";
import { SearchableInvoiceList } from "@/components/invoices/searchable-invoice-list";

export default async function InvoicesPage() {
  const invoices = await dataService.getInvoices();
  const clients = await dataService.getClients();

  const normalizedInvoices = JSON.parse(JSON.stringify(invoices));
  const normalizedClients = JSON.parse(JSON.stringify(clients));

  return (
    <AppShell
      title="Invoices"
      description="Track client payments, manage receivables, and monitor collection health."
      actions={<ActionButton href="/quotations/new">New Quotation</ActionButton>}
    >
      <Panel
        eyebrow="Collections Tracking"
        title="Invoice Ledger"
        description="Search, filter, view, or delete issued invoices."
      >
        <SearchableInvoiceList 
          invoices={normalizedInvoices} 
          clients={normalizedClients} 
        />
      </Panel>
    </AppShell>
  );
}
