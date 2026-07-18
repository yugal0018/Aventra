import { cn } from "@/lib/utils";

// ============================================================
// SKELETON — shimmer loading placeholder
// Usage: <Skeleton className="h-4 w-32" />
// ============================================================

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-muted",
        // Shimmer sweep animation
        "before:absolute before:inset-0",
        "before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
        "before:animate-shimmer before:bg-[length:200%_100%]",
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

// ============================================================
// SKELETON COMPOSITIONS — common loading states
// ============================================================

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border p-6 space-y-3">
      <Skeleton className="h-5 w-1/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

function SkeletonAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" };
  return <Skeleton className={cn("rounded-full", sizes[size])} />;
}

function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-4", i === lines - 1 ? "w-3/4" : "w-full")}
        />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonCard, SkeletonAvatar, SkeletonText };
