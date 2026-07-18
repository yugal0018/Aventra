"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================================
// NAVBAR — Sticky, blur-on-scroll, mobile-responsive
// Design: Stripe × Linear — clean, minimal, confident
// ============================================================

const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
] as const;

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

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
        "fixed left-0 right-0 top-0 z-50 transition-all duration-300",
        isScrolled
          ? "glass shadow-sm"
          : "bg-white/0",
      )}
    >
      <nav
        className="container mx-auto flex h-16 items-center justify-between"
        aria-label="Main navigation"
      >
        {/* ---- Logo ---- */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Aventra home"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-aventra-500 text-white shadow-sm transition-shadow group-hover:shadow-aventra-sm">
            {/* Custom Aventra mark — simple geometric A */}
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

        {/* ---- Desktop Navigation ---- */}
        <ul className="hidden items-center gap-1 md:flex" role="list">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors duration-150",
                    isActive
                      ? "bg-accent font-medium text-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground",
                  )}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* ---- Desktop CTAs ---- */}
        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          <Button
            size="sm"
            className="bg-aventra-500 text-white shadow-sm hover:bg-aventra-600"
            asChild
          >
            <Link href="/signup">
              Join Waitlist
              <span aria-hidden="true" className="ml-0.5">
                →
              </span>
            </Link>
          </Button>
        </div>

        {/* ---- Mobile Menu Toggle ---- */}
        <button
          className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:hidden"
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
      </nav>

      {/* ---- Mobile Menu ---- */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="border-t border-border bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="container mx-auto py-4">
              <ul className="space-y-0.5" role="list">
                {NAV_LINKS.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                        pathname === href
                          ? "bg-aventra-50 text-aventra-700"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-4 space-y-2 border-t border-border pt-4">
                <Button
                  variant="outline"
                  className="w-full justify-center"
                  asChild
                >
                  <Link href="/login">Log in</Link>
                </Button>
                <Button
                  className="w-full justify-center bg-aventra-500 text-white hover:bg-aventra-600"
                  asChild
                >
                  <Link href="/signup">Join Waitlist →</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
