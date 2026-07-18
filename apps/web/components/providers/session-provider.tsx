"use client";

import React from "react";
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

// ============================================================
// SESSION PROVIDER CONTEXT WRAPPER
// Connects client-side hooks like useSession() to NextAuth
// ============================================================

export function SessionProvider({ children }: { children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
