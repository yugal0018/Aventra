"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// ============================================================
// FOOTER — Comprehensive, brand-anchored
// Design: Clean columns, minimal, professional
// ============================================================

const FOOTER_LINKS = {
  product: {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/roadmap", label: "Roadmap" },
      { href: "/changelog", label: "Changelog" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/blog", label: "Blog" },
      { href: "/careers", label: "Careers" },
      { href: "/contact", label: "Contact" },
    ],
  },
  legal: {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
} as const;

const SOCIAL_LINKS = [
  {
    href: "https://twitter.com/aventrahq",
    label: "Twitter",
    ariaLabel: "Aventra on Twitter",
  },
  {
    href: "https://linkedin.com/company/aventrahq",
    label: "LinkedIn",
    ariaLabel: "Aventra on LinkedIn",
  },
 ] as const;

export function Footer() {
  const pathname = usePathname();

  // Hide the footer inside the dashboard console environment
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white" aria-label="Site footer">
      <div className="container mx-auto py-12 lg:py-16">
        {/* ---- Main grid ---- */}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand column */}
          <div className="col-span-2">
            <Link
              href="/"
              className="group mb-4 inline-flex items-center gap-2.5"
              aria-label="Aventra home"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-aventra-500 text-white shadow-sm">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M8 2L14 13H2L8 2Z"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M5.5 9.5H10.5"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className="text-[15px] font-semibold tracking-[-0.01em] text-foreground">
                Aventra
              </span>
            </Link>

            <p className="max-w-[220px] text-sm leading-relaxed text-muted-foreground">
              The professional hiring ecosystem for the modern workforce.
            </p>

            {/* Social links */}
            <div className="mt-5 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ href, label, ariaLabel }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={ariaLabel}
                  className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.values(FOOTER_LINKS).map((section) => (
            <div key={section.title}>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground/60">
                {section.title}
              </h3>
              <ul className="space-y-2.5" role="list">
                {section.links.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ---- Bottom bar ---- */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Aventra, Inc. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for the future of hiring.
          </p>
        </div>
      </div>
    </footer>
  );
}
