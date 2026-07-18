import * as React from "react";
import { cn } from "@/lib/utils";

// ============================================================
// INPUT — with integrated error message display
// ============================================================

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Renders a red error message beneath the input */
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            // Base
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm",
            // Placeholder
            "placeholder:text-muted-foreground",
            // Transitions
            "transition-colors duration-150",
            // Focus
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            // Disabled
            "disabled:cursor-not-allowed disabled:opacity-50",
            // Error state
            error &&
              "border-destructive focus-visible:ring-destructive/50",
            className,
          )}
          aria-invalid={error ? "true" : undefined}
          ref={ref}
          {...props}
        />
        {error && (
          <p
            role="alert"
            className="mt-1.5 text-xs text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
