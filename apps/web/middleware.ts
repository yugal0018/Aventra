import { withAuth } from "next-auth/middleware";

// ============================================================
// SESSION MIDDLEWARE ACCESS GUARD
// Automatically redirects unauthenticated traffic trying to
// hit /dashboard/* back to /login.
// ============================================================

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*"],
};
