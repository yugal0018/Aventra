"use client";

import React, { useState } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LogOut, 
  Bell, 
  Settings, 
  Menu, 
  X, 
  LayoutDashboard, 
  User as UserIcon, 
  Briefcase, 
  Search, 
  Building, 
  ClipboardList, 
  MessageSquare 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";

// Lucide Icon mapper for mobile navigation drawer
const ICON_MAP: Record<string, React.ComponentType<any>> = {
  dashboard: LayoutDashboard,
  user: UserIcon,
  briefcase: Briefcase,
  search: Search,
  building: Building,
  applications: ClipboardList,
  messages: MessageSquare,
};

interface SidebarItem {
  href: string;
  label: string;
  icon: string;
}

interface DashboardHeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
  navItems: SidebarItem[];
}

export function DashboardHeader({ user, navItems }: DashboardHeaderProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();
  const { toast } = useToast();

  const handleSignOut = () => {
    toast({
      variant: "info",
      title: "Signing out...",
      description: "Ending console session parameters securely.",
    });
    void signOut({ callbackUrl: "/" });
  };

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const formattedRole = user.role
    .replace("_ADMIN", " (Admin)")
    .replace("_MEMBER", " (Member)")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <header className="flex h-16 w-full items-center justify-between border-b border-border bg-white px-4 sm:px-6 md:px-8 shrink-0 select-none z-30">
        
        {/* Left Side: Hamburger & Branding on Mobile, Breadcrumb on Desktop */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburguer Toggle */}
          <button
            onClick={() => setIsMobileOpen((prev) => !prev)}
            className="flex md:hidden rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors focus:outline-none"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Branding Logo (Visible on mobile since sidebar is hidden) */}
          <div className="flex md:hidden items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-aventra-500 text-white font-bold text-xs shrink-0">
              A
            </div>
            <span className="font-bold text-sm tracking-tight text-foreground">Aventra</span>
            <div className="h-4 w-px bg-slate-200" />
          </div>

          {/* breadcrumb */}
          <span className="hidden sm:inline-block text-xs font-bold text-slate-400 capitalize">
            Workspace Dashboard
          </span>
        </div>

        {/* Center Section: Centered header element */}
        <div className="hidden lg:flex items-center justify-center">
          <span className="text-[10px] font-bold text-aventra-600 bg-aventra-50 border border-aventra-100 rounded-full px-3 py-1 uppercase tracking-wider animate-pulse">
            Active Developer Beta Console
          </span>
        </div>

        {/* Right Side Controls Group (consistent spacing 16-24px) */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
          {/* Alerts / Notifications */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              toast({
                variant: "info",
                title: "Notifications",
                description: "No new notifications in active beta.",
              })
            }
            className="relative h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl"
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-aventra-500" />
          </Button>

          {/* Settings button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              toast({
                variant: "info",
                title: "Console Settings",
                description: "Settings profiles will be editable in full release.",
              })
            }
            className="h-8 w-8 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl"
          >
            <Settings className="h-4.5 w-4.5" />
          </Button>

          {/* Divider */}
          <div className="h-5 w-px bg-slate-200" />

          {/* User info and signout (strict truncation to prevent layout shift) */}
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8 ring-2 ring-slate-100 shrink-0">
              <AvatarFallback className="text-xs font-bold">{userInitials}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left min-w-0 max-w-[120px] lg:max-w-[180px]">
              <p className="text-[11px] font-bold text-slate-900 leading-tight truncate">{user.name}</p>
              <p className="text-[9px] text-slate-400 mt-0.5 truncate leading-tight">{user.email}</p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl ml-1 shrink-0"
              title="Log out of console"
            >
              <LogOut className="h-4.5 w-4.5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer menu overlay for sidebar navigation items */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Left drawer panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative flex w-full max-w-xs flex-col bg-white p-6 shadow-xl z-10"
            >
              {/* Header drawer controls */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-aventra-500 text-white font-bold text-sm">
                    A
                  </div>
                  <span className="font-bold text-base tracking-tight text-foreground">Aventra</span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 focus:outline-none"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation links drawer list */}
              <nav className="flex-1 space-y-1.5 pt-6">
                {navItems.map((item) => {
                  const Icon = ICON_MAP[item.icon] || Briefcase;
                  const isActive = pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 text-xs font-semibold rounded-xl transition-all duration-150",
                        isActive
                          ? "bg-aventra-50 text-aventra-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-aventra-600" : "text-slate-400")} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* User panel inside drawer */}
              <div className="border-t border-slate-100 pt-4 mt-auto">
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-1.5">
                  <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-aventra-500" />
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{formattedRole}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
