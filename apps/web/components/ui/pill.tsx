import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

// ============================================================
// PILL — announcement badge / hero eyebrow
// Used above headlines: "✦ Now accepting early access"
// ============================================================

interface PillProps {
  children: React.ReactNode;
  /** Optional Lucide icon displayed before children */
  icon?: LucideIcon;
  /** Animated pulsing dot — draws attention */
  pulseDot?: boolean;
  variant?: "aventra" | "default" | "success" | "warning";
  className?: string;
}

const pillStyles = {
  aventra:
    "border-aventra-200 bg-aventra-50 text-aventra-700",
  default:
    "border-border bg-muted/60 text-muted-foreground",
  success:
    "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning:
    "border-amber-200 bg-amber-50 text-amber-700",
} as const;

const dotStyles = {
  aventra: "bg-aventra-500",
  default: "bg-muted-foreground",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
} as const;

export function Pill({
  children,
  icon: Icon,
  pulseDot = false,
  variant = "aventra",
  className,
}: PillProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium",
        pillStyles[variant],
        className,
      )}
    >
      {pulseDot && (
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full animate-pulse-dot",
            dotStyles[variant],
          )}
          aria-hidden="true"
        />
      )}
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      {children}
    </div>
  );
}
