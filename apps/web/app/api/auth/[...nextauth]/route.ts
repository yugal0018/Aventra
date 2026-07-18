import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// ============================================================
// NEXT-AUTH ROUTE INTERCEPTORS
// Intercepts all next-auth session and callback queries
// ============================================================

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
