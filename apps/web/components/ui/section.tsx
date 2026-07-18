import { cn } from "@/lib/utils";

// ============================================================
// SECTION — consistent page section container
// Handles vertical padding and container centering
// ============================================================

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Controls vertical padding preset */
  size?: "sm" | "md" | "lg" | "xl";
  /** Renders as <div> instead of <section> when needed */
  as?: "section" | "div" | "article";
  /** Class applied to the inner container div */
  containerClassName?: string;
  /** Disable the inner container (for full-bleed sections) */
  noContainer?: boolean;
}

const sectionPadding = {
  sm: "py-10 lg:py-14",
  md: "py-16 lg:py-20",
  lg: "py-20 lg:py-28",
  xl: "py-24 lg:py-32",
} as const;

export function Section({
  children,
  className,
  containerClassName,
  size = "lg",
  as: Component = "section",
  noContainer = false,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(sectionPadding[size], className)}
      {...props}
    >
      {noContainer ? (
        children
      ) : (
        <div className={cn("container mx-auto", containerClassName)}>
          {children}
        </div>
      )}
    </Component>
  );
}

// ============================================================
// SECTION HEADER — eyebrow + headline + description
// Used at the top of every major landing page section
// ============================================================

interface SectionHeaderProps {
  /** Small label above the title e.g. "Why Aventra" */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Text alignment. Center is default for marketing pages */
  align?: "left" | "center";
  /** Limits max width for centered headers */
  maxWidth?: "sm" | "md" | "lg" | "none";
  className?: string;
}

const maxWidths = {
  sm: "max-w-lg",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  none: "",
} as const;

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  maxWidth = "md",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 lg:mb-16",
        align === "center" && "text-center",
        align === "center" && maxWidths[maxWidth] && "mx-auto",
        maxWidths[maxWidth],
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-aventra-600">
          {eyebrow}
        </p>
      )}
      <h2 className="text-display-md font-bold tracking-tight text-foreground text-balance lg:text-display-lg">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-balance">
          {description}
        </p>
      )}
    </div>
  );
}
