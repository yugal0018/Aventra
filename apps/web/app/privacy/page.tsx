"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Section, SectionHeader } from "@/components/ui/section";

export default function PrivacyPage() {
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
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Compliance Desk</span>
        </div>

        <h1 className="text-display-md font-bold tracking-tight text-foreground sm:text-display-lg mb-4">
          Privacy Policy
        </h1>
        <p className="text-xs text-muted-foreground mb-8">Last Updated: July 17, 2026</p>

        <div className="prose prose-slate max-w-none text-sm text-muted-foreground leading-relaxed space-y-6">
          <p>
            At Aventra ("we", "our", "us"), we prioritize the privacy and security of our users. This Privacy Policy details how we collect, process, and protect your information when you register for our waitlist or use our website (aventra.io).
          </p>

          <h3 className="text-base font-bold text-foreground pt-4">1. Information We Collect</h3>
          <p>
            When you join the Aventra waitlist, register for access keys, or fill out our contact inquiry form, we collect the following data:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Personal Details:</strong> Full name and contact email address.</li>
            <li><strong>Workforce Classification:</strong> Your professional category (Candidate, Recruiter, Company representative, or Agency recruiter).</li>
            <li><strong>Referral source:</strong> Identity parameters of referrers if using priority access links.</li>
          </ul>

          <h3 className="text-base font-bold text-foreground pt-4">2. How We Use Your Data</h3>
          <p>
            We process collected information to manage waitlist sequences, prioritize access allocations by category, communicate feature releases, and resolve support requests. We do not sell your personal data to third-party advertisers.
          </p>

          <h3 className="text-base font-bold text-foreground pt-4">3. Data Retention</h3>
          <p>
            Waitlist registration details are preserved until the launch of our platform consoles, at which point you will be invited to upgrade your credentials or request data deletion. You may request soft or hard removal from our waitlist at any time by contacting hello@aventra.io.
          </p>

          <h3 className="text-base font-bold text-foreground pt-4">4. Security Measures</h3>
          <p>
            We enforce secure communication protocols (HTTPS) and encrypt database volumes using key management services. Access to user contact lists is restricted to founders and primary systems administrators.
          </p>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {currentYear} Aventra, Inc. All rights reserved.
        </div>
      </div>
    </div>
  );
}
