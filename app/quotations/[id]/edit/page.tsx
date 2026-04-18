import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { EditQuotationWorkspace } from "@/components/quotations/edit-quotation-workspace";
import * as dataService from "@/lib/data-service";
import { notFound } from "next/navigation";

export default async function EditQuotationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const quotation = await dataService.getQuotationById(id);
  
  if (!quotation) {
    notFound();
  }

  const clients = await dataService.getClients();
  const serviceCatalog = await dataService.getServiceCatalog();
  const suggestedPackages = await dataService.getSuggestedPackages();

  // Normalize data for client-side consumption
  const normalizedQuotation = JSON.parse(JSON.stringify(quotation));
  const normalizedClients = JSON.parse(JSON.stringify(clients));
  const normalizedServices = JSON.parse(JSON.stringify(serviceCatalog));
  const normalizedPackages = JSON.parse(JSON.stringify(suggestedPackages));

  return (
    <AppShell
      title={`Edit Quotation ${normalizedQuotation.quotationNumber}`}
      description="Refine details, update line items, or adjust terms for this proposal."
      actions={
        <>
          <ActionButton href={`/quotations/${id}`} variant="secondary">
            Cancel
          </ActionButton>
          <ActionButton href="/quotations">Document list</ActionButton>
        </>
      }
    >
      <EditQuotationWorkspace
        initialQuotation={normalizedQuotation}
        clients={normalizedClients}
        serviceCatalog={normalizedServices}
        suggestedPackages={normalizedPackages}
      />
    </AppShell>
  );
}
