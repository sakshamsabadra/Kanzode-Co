"use client";

import { ActionButton } from "@/components/ui/action-button";

export function ShareButton() {
  return (
    <ActionButton variant="ghost" onClick={() => { 
      if (typeof window !== 'undefined') {
        navigator.clipboard.writeText(window.location.href);
        const { toast } = require("react-hot-toast"); 
        toast.success("Share link copied to clipboard!"); 
      }
    }}>
      Share link
    </ActionButton>
  );
}

export function PrintButton() {
  return (
    <ActionButton variant="ghost" onClick={() => { if (typeof window !== 'undefined') window.print(); }}>
      Print
    </ActionButton>
  );
}

import { toast } from "react-hot-toast";
import { convertSavedQuotationToInvoice, sendSavedQuotation, markInvoicePaidAction } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function ConvertQuotationButton({ quotationId }: { quotationId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  return (
    <ActionButton 
      disabled={loading}
      onClick={async () => {
        try {
          setLoading(true);
          toast.loading("Converting to invoice...", { id: "convert" });
          const invId = await convertSavedQuotationToInvoice(quotationId);
          toast.success("Converted successfully!", { id: "convert" });
          router.push(`/invoices/${invId}`);
        } catch (e) {
          toast.error("Failed to convert quotation.", { id: "convert" });
          setLoading(false);
        }
      }}
    >
      {loading ? "Converting..." : "Convert to invoice"}
    </ActionButton>
  );
}

export function DeliverPortalButton({ quotationId }: { quotationId: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <ActionButton 
      variant="secondary"
      disabled={loading}
      onClick={async () => {
        try {
          setLoading(true);
          toast.loading("Sending to portal...", { id: "send" });
          await sendSavedQuotation(quotationId);
          toast.success("Successfully delivered to portal!", { id: "send" });
        } catch (e) {
          toast.error("Failed to send quotation.", { id: "send" });
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? "Sending..." : "Deliver via portal"}
    </ActionButton>
  );
}

export function RecordPaymentButton({ invoiceId, disabled }: { invoiceId: string, disabled?: boolean }) {
  const [loading, setLoading] = useState(false);
  return (
    <ActionButton 
      disabled={disabled || loading}
      onClick={async () => {
        try {
          setLoading(true);
          toast.loading("Recording payment...", { id: "pay" });
          await markInvoicePaidAction(invoiceId);
          toast.success("Payment recorded successfully!", { id: "pay" });
        } catch (e) {
          toast.error("Failed to record payment.", { id: "pay" });
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? "Recording..." : "Record payment"}
    </ActionButton>
  );
}
