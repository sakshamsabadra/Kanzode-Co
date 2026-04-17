"use client";

import { ActionButton } from "@/components/ui/action-button";

export function ShareButton() {
  return (
    <ActionButton variant="ghost" onClick={() => { if (typeof window !== 'undefined') navigator.clipboard.writeText(window.location.href); }}>
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
