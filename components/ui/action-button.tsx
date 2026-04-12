import Link from "next/link";
import { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
}

const variantClassNames = {
  primary: "bg-slate-950 text-white hover:bg-black",
  secondary:
    "border border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100"
};

export function ActionButton({
  children,
  href,
  variant = "primary",
  className,
  ...props
}: ActionButtonProps) {
  const baseClass = cn(
    "inline-flex items-center justify-center rounded-[6px] px-4 py-2.5 text-sm font-semibold transition",
    variantClassNames[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {children}
      </Link>
    );
  }

  return (
    <button className={baseClass} {...props}>
      {children}
    </button>
  );
}
