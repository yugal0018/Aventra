"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Search,
  Building,
  ClipboardList,
  MessageSquare
} from "lucide-react";

// ============================================================
// CLIENT SIDE ICON MAPPER
// Maps serializable string identifiers to Lucide Component functions
// to support Next.js RSC boundary constraints safely.
// ============================================================
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  dashboard: LayoutDashboard,
  user: User,
  briefcase: Briefcase,
  search: Search,
  building: Building,
  applications: ClipboardList,
  messages: MessageSquare,
};

interface SidebarItem {
  href: string;
  label: string;
  icon: string; // Serializable string key
}

interface DashboardSidebarProps {
  navItems: SidebarItem[];
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export function DashboardSidebar({ navItems, user }: DashboardSidebarProps) {
  const pathname = usePathname();

  const formattedRole = user.role
    .replace("_ADMIN", " (Admin)")
    .replace("_MEMBER", " (Member)")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-white p-5 shrink-0 select-none">
      {/* Upper Logo Wordmark */}
      <div className="flex items-center gap-2 px-2 py-4 mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-aventra-500 text-white shadow-sm font-bold text-sm">A</div>
        <span className="font-bold text-lg tracking-tight text-foreground">Aventra Console</span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5 pt-2">
        {navItems.map((item) => {
          const Icon = ICON_MAP[item.icon] || Briefcase;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-lg transition-colors duration-150",
                isActive
                  ? "bg-aventra-50 text-aventra-700"
                  : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-aventra-600" : "text-muted-foreground/60")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User Footer Panel */}
      <div className="border-t border-border pt-4 mt-auto">
        <div className="rounded-xl border border-border bg-slate-50/50 p-3.5 space-y-1">
          <p className="text-xs font-bold text-foreground truncate">{user.name}</p>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-aventra-500 animate-pulse" />
            <span className="text-[10px] font-bold text-muted-foreground">{formattedRole}</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
