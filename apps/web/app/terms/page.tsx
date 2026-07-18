"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";

export default function TermsPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="relative overflow-hidden bg-background py-16 lg:py-24">
      <div className="container mx-auto max-w-3xl px-4">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Return to home page
        </Link>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
            <Shield className="h-4 w-4" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Legal Desk</span>
        </div>

        <h1 className="text-display-md font-bold tracking-tight text-foreground sm:text-display-lg mb-4">
          Terms of Service
        </h1>
        <p className="text-xs text-muted-foreground mb-8">Last Updated: July 17, 2026</p>

        <div className="prose prose-slate max-w-none text-sm text-muted-foreground leading-relaxed space-y-6">
          <p>
            Welcome to Aventra. By accessing our marketing website (aventra.io) or joining our waitlist programs, you agree to comply with the following Terms of Service.
          </p>

          <h3 className="text-base font-bold text-foreground pt-4">1. Waitlist Registration</h3>
          <p>
            Aventra waitlist allocations and invite passes are provided at our sole discretion. Registration does not guarantee access, console credentials, or price locks for paid plans in future launch phases. Users must provide valid, accurate, and professional contact information during signup.
          </p>

          <h3 className="text-base font-bold text-foreground pt-4">2. Intellectual Property</h3>
          <p>
            All code design system assets, animations, mockups, typography palettes, and custom logos rendered on our marketing portal are the exclusive intellectual property of Aventra, Inc. and are protected by applicable trademark and copyright legislation.
          </p>

          <h3 className="text-base font-bold text-foreground pt-4">3. Acceptable Use</h3>
          <p>
            Users may not deploy automated scrapers, indexers, or request spammers to query our waitlist and contact API endpoints. Submitting false, malicious, or abusive contact records will result in immediate block of IP credentials.
          </p>

          <h3 className="text-base font-bold text-foreground pt-4">4. Liability Limits</h3>
          <p>
            Aventra is currently in an early beta waitlist phase. We provide access "as-is" and do not accept liability for service disruptions, schedule delays, or data losses resulting from third-party hosting providers.
          </p>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {currentYear} Aventra, Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
