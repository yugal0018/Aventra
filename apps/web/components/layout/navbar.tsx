"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

// ============================================================
// NAVBAR — Refactored to follow modern UI/UX best practices
// Features grid-alignment for perfect centering, consistent
// spacing, and fluid responsive design.
// ============================================================

const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
] as const;

export function Navbar() {
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";

  const pathname = usePathname();

  // Do not render the public landing page navbar on private dashboard console routes
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 12);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300 w-full border-b border-transparent shrink-0",
        isScrolled
          ? "glass shadow-sm border-slate-100"
          : "bg-white/0",
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav
          className="grid grid-cols-2 md:grid-cols-3 h-16 items-center"
          aria-label="Main navigation"
        >
          {/* Logo - Far Left */}
          <div className="flex items-center justify-start">
            <Link
              href="/"
              className="group flex items-center gap-2.5 shrink-0"
              aria-label="Aventra home"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-aventra-500 text-white shadow-sm transition-shadow group-hover:shadow-aventra-sm">
                <svg
                  width="18"
                  height="18"
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
              <span className="text-[16px] font-bold tracking-tight text-foreground">
                Aventra
              </span>
            </Link>
          </div>

          {/* Primary Links - Centered Horizontally */}
          <div className="hidden md:flex items-center justify-center">
            <ul className="flex items-center gap-1 lg:gap-2" role="list">
              {NAV_LINKS.map(({ href, label }) => {
                const isActive = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-200",
                        isActive
                          ? "bg-slate-50 text-aventra-700"
                          : "text-slate-600 hover:bg-slate-50/50 hover:text-slate-900",
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Desktop CTAs & Mobile Toggle - Far Right */}
          <div className="flex items-center justify-end gap-3 sm:gap-4">
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-3">
                <Button
                  size="sm"
                  className="bg-aventra-600 text-white shadow-sm hover:bg-aventra-700 font-bold rounded-xl px-4"
                  asChild
                >
                  <Link href="/dashboard">
                    Go to Console
                    <span aria-hidden="true" className="ml-1">
                      →
                    </span>
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Button variant="ghost" size="sm" className="font-bold text-slate-600 hover:text-slate-900 rounded-xl" asChild>
                  <Link href="/login">Log in</Link>
                </Button>
                <Button
                  size="sm"
                  className="bg-aventra-600 text-white shadow-sm hover:bg-aventra-700 font-bold rounded-xl px-4"
                  asChild
                >
                  <Link href="/signup">
                    Join Waitlist
                    <span aria-hidden="true" className="ml-1">
                      →
                    </span>
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Toggle button */}
            <button
              className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors md:hidden focus:outline-none"
              onClick={() => setIsMobileOpen((prev) => !prev)}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileOpen ? "Close menu" : "Open menu"}
            >
              {isMobileOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer Overlay & Content */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="border-t border-slate-100 bg-white/95 backdrop-blur-xl md:hidden w-full absolute left-0 top-16 shadow-lg z-40"
          >
            <div className="px-6 py-6 space-y-6">
              <ul className="space-y-1.5" role="list">
                {NAV_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "block rounded-xl px-4 py-3 text-sm font-semibold transition-colors",
                        pathname === href
                          ? "bg-aventra-50 text-aventra-700"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="space-y-3 pt-4 border-t border-slate-100">
                {isAuthenticated ? (
                  <Button
                    className="w-full justify-center rounded-xl py-3 text-sm font-bold bg-aventra-600 text-white hover:bg-aventra-700"
                    asChild
                  >
                    <Link href="/dashboard">Go to Console →</Link>
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-center rounded-xl py-3 text-sm font-bold border-slate-200"
                      asChild
                    >
                      <Link href="/login">Log in</Link>
                    </Button>
                    <Button
                      className="w-full justify-center rounded-xl py-3 text-sm font-bold bg-aventra-600 text-white hover:bg-aventra-700"
                      asChild
                    >
                      <Link href="/signup">Join Waitlist →</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
