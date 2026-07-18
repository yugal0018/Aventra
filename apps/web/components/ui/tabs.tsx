"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ============================================================
// TABS — two visual variants:
// "default": subtle underline (standard)
// "pills": filled pill switcher (for persona switcher on landing)
// ============================================================

const TabsContext = React.createContext<{ variant?: "default" | "pills" }>({});

const tabsListVariants = cva("inline-flex items-center", {
  variants: {
    variant: {
      default:
        "h-9 rounded-lg bg-muted p-1 text-muted-foreground",
      pills:
        "gap-1 rounded-full border border-border bg-white p-1 shadow-card",
    },
  },
  defaultVariants: { variant: "default" },
});

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "rounded-md px-3 py-1 ring-offset-background data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        pills:
          "rounded-full px-4 py-1.5 text-muted-foreground data-[state=active]:bg-aventra-500 data-[state=active]:text-white data-[state=active]:shadow-aventra-sm",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

interface TabsProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>,
    VariantProps<typeof tabsListVariants> {}

function Tabs({ variant, ...props }: TabsProps) {
  return (
    <TabsContext.Provider value={{ variant: variant ?? "default" }}>
      <TabsPrimitive.Root {...props} />
    </TabsContext.Provider>
  );
}

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(TabsContext);
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
});
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(TabsContext);
  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-6 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "data-[state=inactive]:animate-fade-out-scale data-[state=active]:animate-fade-in-scale",
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
