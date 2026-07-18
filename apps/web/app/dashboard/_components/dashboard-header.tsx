"use client";

import React from "react";
import { signOut } from "next-auth/react";
import { LogOut, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
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

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border bg-white px-6 shrink-0 select-none">
      {/* Title placeholder */}
      <div>
        <span className="text-xs font-bold text-foreground capitalize">Workspace Dashboard</span>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
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
          className="relative h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4.5 w-4.5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-aventra-500" />
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
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4.5 w-4.5" />
        </Button>

        {/* Divider */}
        <div className="h-5 w-px bg-border" />

        {/* User avatar and logout */}
        <div className="flex items-center gap-2.5">
          <Avatar size="sm" className="ring-2 ring-slate-100">
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <div className="hidden lg:block text-left">
            <p className="text-[11px] font-bold text-foreground leading-none">{user.name}</p>
            <p className="text-[9px] text-muted-foreground mt-0.5 max-w-[100px] truncate leading-none">{user.email}</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-700 ml-1"
            title="Log out of console"
          >
            <LogOut className="h-4.5 w-4.5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
