import Link from "next/link";
import { ReactNode, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
}

const variantClassNames = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary:
    "border border-blue-200 bg-white text-brand-900 hover:bg-brand-50",
  ghost: "bg-transparent text-brand-700 hover:bg-brand-50"
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
