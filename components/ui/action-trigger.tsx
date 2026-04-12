"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ActionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

const variantClassNames = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary:
    "border border-blue-200 bg-white text-brand-900 hover:bg-brand-50",
  ghost: "bg-transparent text-brand-700 hover:bg-brand-50"
};

export function ActionTrigger({
  children,
  className,
  variant = "primary",
  ...props
}: ActionTriggerProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variantClassNames[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
