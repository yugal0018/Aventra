"use client";

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toastIcons,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

// ============================================================
// TOASTER — renders active toasts via a portal
// Add <Toaster /> once to app/layout.tsx
// ============================================================

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider swipeDirection="right">
      {toasts.map(({ id, title, description, variant, ...props }) => (
        <Toast key={id} variant={variant} {...props}>
          {/* Variant icon */}
          {variant && variant !== "default" && toastIcons[variant]}

          <div className="flex-1 min-w-0">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && (
              <ToastDescription>{description}</ToastDescription>
            )}
          </div>

          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}
