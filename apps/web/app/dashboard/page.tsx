import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ============================================================
// DASHBOARD INDEX PAGE — Server Component
// Inspects user roles and redirects to their primary workspace
// ============================================================

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const role = (session.user as any).role;

  // Role routing redirection
  if (role === "CANDIDATE") {
    redirect("/dashboard/profile");
  } else {
    redirect("/dashboard/pipeline");
  }
}
