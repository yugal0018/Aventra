import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DashboardHeader } from "./_components/dashboard-header";
import { DashboardSidebar } from "./_components/dashboard-sidebar";

// ============================================================
// DASHBOARD WORKSPACE LAYOUT — Server Component
// Handles session validation, role verification, and layout setup
// ============================================================

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as {
    name: string;
    email: string;
    role: string;
    id: string;
  };

  // Define sidebar navigation items based on user roles
  const getNavItems = (role: string) => {
    const baseItems = [
      { href: "/dashboard", label: "Overview", icon: "dashboard" },
    ];

    if (role === "CANDIDATE") {
      return [
        ...baseItems,
        { href: "/dashboard/profile", label: "My Profile", icon: "user" },
        { href: "/dashboard/jobs", label: "Browse Jobs", icon: "briefcase" },
        { href: "/dashboard/applications", label: "Applications", icon: "applications" },
        { href: "/dashboard/messages", label: "Messages", icon: "messages" },
      ];
    }

    if (role === "RECRUITER" || role === "COMPANY_ADMIN" || role === "COMPANY_MEMBER") {
      return [
        ...baseItems,
        { href: "/dashboard/sourcing", label: "Talent Search", icon: "search" },
        { href: "/dashboard/pipeline", label: "Jobs Board", icon: "briefcase" },
        { href: "/dashboard/company", label: "Company profile", icon: "building" },
        { href: "/dashboard/messages", label: "Messages", icon: "messages" },
      ];
    }

    // Agency admin/member items
    return [
      ...baseItems,
      { href: "/dashboard/sourcing", label: "Talent Search", icon: "search" },
      { href: "/dashboard/pipeline", label: "Shared Pipelines", icon: "applications" },
      { href: "/dashboard/agency", label: "Agency profile", icon: "building" },
      { href: "/dashboard/messages", label: "Messages", icon: "messages" },
    ];
  };

  const navItems = getNavItems(user.role);

  return (
    <div className="flex min-h-[calc(100vh-64px)] w-full bg-slate-50/50">
      {/* Dynamic Role-Based Sidebar */}
      <DashboardSidebar navItems={navItems} user={user} />

      {/* Main Workspace Console */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader user={user} />
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
