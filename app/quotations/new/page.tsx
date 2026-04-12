import { AppShell } from "@/components/layout/app-shell";
import { ActionButton } from "@/components/ui/action-button";
import { NewQuotationWorkspace } from "@/components/quotations/new-quotation-workspace";
import { getClients, getServiceCatalog, getSuggestedPackages } from "@/lib/mock-storage";

export default function NewQuotationPage() {
  return (
    <AppShell
      title="New Quotation"
      description="Turn a plain-English or WhatsApp-style request into a polished quotation with mock AI extraction and premium commercial formatting."
      actions={
        <>
          <ActionButton href="/dashboard" variant="secondary">
            Back to dashboard
          </ActionButton>
          <ActionButton href="/quotations/qt-1001">Open sample quotation</ActionButton>
        </>
      }
    >
      <NewQuotationWorkspace
        initialClients={getClients()}
        serviceCatalog={getServiceCatalog()}
        suggestedPackages={getSuggestedPackages()}
      />
    </AppShell>
  );
}
