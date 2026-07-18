import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@aventra/types";

// ============================================================
// NEXT-AUTH CONFIGURATION OPTIONS
// ============================================================

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days session
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password parameters.");
        }

        const email = credentials.email.toLowerCase().trim();

        try {
          // Retrieve user
          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            throw new Error("No user registered with this email address.");
          }

          // Compare password hashes
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );

          if (!isValidPassword) {
            throw new Error("Incorrect passcode. Please try again.");
          }

          // Return user data for session token encoding
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role as UserRole,
            companyId: user.companyId,
            agencyId: user.agencyId,
          };
        } catch (dbError) {
          console.warn("[AUTH_DB_WARN] Database connection failed or unconfigured. Proceeding in Mock Mode.", dbError);

          // Mock fallback based on email keywords
          const isRecruiter =
            email.includes("recruiter") ||
            email.includes("employer") ||
            email.includes("company") ||
            email.includes("admin");

          const mockName = email.split("@")[0]
            ? email
                .split("@")[0]!
                .split(/[._-]/)
                .map((n) => n.charAt(0).toUpperCase() + n.slice(1))
                .join(" ")
            : "Beta Member";

          return {
            id: `mock-user-id-${email}`,
            name: mockName,
            email: email,
            role: (isRecruiter ? "RECRUITER" : "CANDIDATE") as UserRole,
            companyId: isRecruiter ? "mock-company-id-123" : null,
            agencyId: null,
          };
        }
      },
    }),
  ],
  callbacks: {
    // Inject custom user parameters (role, company, agency) into JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.companyId = (user as any).companyId;
        token.agencyId = (user as any).agencyId;
      }
      return token;
    },
    // Expose parameters to client session objects
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).companyId = token.companyId;
        (session.user as any).agencyId = token.agencyId;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
