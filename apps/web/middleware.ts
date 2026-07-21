import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

// Secure HTTP headers to prevent Clickjacking, MIME sniffing, and XSS
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  {
    key: "Content-Security-Policy",
    value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; object-src 'none'; frame-ancestors 'none';"
  }
];

// NextAuth middleware wrapped to inject security headers on private pages
const authMiddleware = withAuth(
  function middleware() {
    const response = NextResponse.next();
    securityHeaders.forEach(({ key, value }) => {
      response.headers.set(key, value);
    });
    return response;
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect all dashboard routes using NextAuth
  if (pathname.startsWith("/dashboard")) {
    return (authMiddleware as any)(req);
  }

  // Inject security headers on all other public routes
  const response = NextResponse.next();
  securityHeaders.forEach(({ key, value }) => {
    response.headers.set(key, value);
  });
  return response;
}

export const config = {
  // Run middleware on all routes except static assets, favicon, and api routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
