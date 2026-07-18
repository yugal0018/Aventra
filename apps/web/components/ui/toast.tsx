"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// TOAST — Radix UI toast primitives with Aventra styling
// ============================================================

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-4 right-4 z-[100] flex max-h-screen w-full max-w-[380px] flex-col gap-2",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  [
    "group pointer-events-auto relative flex w-full items-start gap-3 overflow-hidden rounded-xl border p-4",
    "shadow-card-hover transition-all duration-200",
    "data-[state=open]:animate-slide-in-right",
    "data-[state=closed]:animate-slide-out-right",
    "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
    "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
  ],
  {
    variants: {
      variant: {
        default: "border-border bg-background text-foreground",
        success:
          "border-emerald-200 bg-emerald-50 text-emerald-900",
        destructive:
          "border-red-200 bg-red-50 text-red-900",
        warning:
          "border-amber-200 bg-amber-50 text-amber-900",
        info:
          "border-sky-200 bg-sky-50 text-sky-900",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

// Icon map per variant
const toastIcons: Record<string, React.ReactNode> = {
  success: <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />,
  destructive: <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />,
  warning: <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />,
  info: <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-600" />,
};

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
    VariantProps<typeof toastVariants> {
  duration?: number;
}

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitives.Root
    ref={ref}
    className={cn(toastVariants({ variant }), className)}
    {...props}
  />
));
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-transparent px-3 text-sm font-medium",
      "transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "ml-auto shrink-0 rounded-md p-1 opacity-50 transition-opacity hover:opacity-100",
      "focus:outline-none focus:ring-1 focus:ring-ring",
      className,
    )}
    toast-close=""
    aria-label="Close notification"
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-sm font-semibold leading-none", className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("mt-1 text-sm opacity-80 leading-relaxed", className)}
    {...props}
  />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  toastIcons,
};
