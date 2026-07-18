import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { SessionProvider } from "@/components/providers/session-provider";

// ============================================================
// METADATA — Applied to all pages (overridable per-page)
// ============================================================

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "https://aventra.io",
  ),
  title: {
    default: "Aventra — The Professional Hiring Ecosystem",
    template: "%s | Aventra",
  },
  description:
    "One ecosystem for candidates, recruiters, companies, and agencies. Built for the way modern hiring works.",
  keywords: [
    "hiring platform",
    "recruitment software",
    "ATS",
    "applicant tracking system",
    "job board",
    "talent acquisition",
    "recruitment agency",
    "job search",
    "candidate management",
    "recruiter tools",
  ],
  authors: [{ name: "Aventra", url: "https://aventra.io" }],
  creator: "Aventra",
  publisher: "Aventra",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://aventra.io",
    title: "Aventra — The Professional Hiring Ecosystem",
    description:
      "One ecosystem for candidates, recruiters, companies, and agencies.",
    siteName: "Aventra",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aventra — The Professional Hiring Ecosystem",
    description:
      "One ecosystem for candidates, recruiters, companies, and agencies.",
    creator: "@aventrahq",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

// ============================================================
// ROOT LAYOUT
// ============================================================

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      // suppressHydrationWarning prevents React mismatch on dark mode toggle
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Aventra",
              "url": "https://aventra.io",
              "logo": "https://aventra.io/logo.png",
              "sameAs": [
                "https://twitter.com/aventrahq",
                "https://linkedin.com/company/aventrahq"
              ],
              "description": "One ecosystem for candidates, recruiters, companies, and agencies. Built for the way modern hiring works."
            })
          }}
        />
      </head>
      <body
        className={cn(
          GeistSans.variable,
          GeistMono.variable,
          "min-h-screen bg-background font-sans antialiased",
        )}
      >
        <SessionProvider>
          {/* Skip to main content — accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:text-sm focus:font-medium"
          >
            Skip to main content
          </a>

          <Navbar />

          <main id="main-content" className="flex-1">
            {children}
          </main>

          <Footer />
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
