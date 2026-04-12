"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ActionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
}

const variantClassNames = {
  primary: "bg-slate-950 text-white hover:bg-black",
  secondary:
    "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100"
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
