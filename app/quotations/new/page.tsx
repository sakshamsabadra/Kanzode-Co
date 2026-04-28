export const dynamic = "force-dynamic";
export const revalidate = 0;

import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { NewQuotationWorkspace } from "@/components/quotations/new-quotation-workspace";
import * as dataService from "@/lib/data-service";

export default async function NewQuotationPage() {
  const clients = await dataService.getClients().catch((error) => {
    console.error("Failed to load clients:", error);
    return [];
  });

  const serviceCatalog = await dataService.getServiceCatalog().catch((error) => {
    console.error("Failed to load service catalog:", error);
    return [];
  });

  const suggestedPackages = await dataService.getSuggestedPackages().catch((error) => {
    console.error("Failed to load suggested packages:", error);
    return [];
  });

  return (
    <AppShell
      title="New Quotation"
      description="Turn a plain-English or WhatsApp-style request into a polished quotation with AI extraction and premium commercial formatting."
      actions={
        <>
          <ActionButton href="/dashboard" variant="secondary">
            Back to dashboard
          </ActionButton>
          <ActionButton href="/quotations">View quotations</ActionButton>
        </>
      }
    >
      <NewQuotationWorkspace
        initialClients={JSON.parse(JSON.stringify(clients))}
        serviceCatalog={JSON.parse(JSON.stringify(serviceCatalog))}
        suggestedPackages={JSON.parse(JSON.stringify(suggestedPackages))}
      />
    </AppShell>
  );
}
