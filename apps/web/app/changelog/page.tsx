"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Calendar, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal, StaggerGroup } from "@/components/ui/reveal";

export default function ChangelogPage() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 bg-indigo-500/5 blur-[100px]" />

      {/* Hero Header */}
      <Section size="lg" className="pt-24 lg:pt-32 text-center max-w-3xl mx-auto">
        <Reveal direction="up" delay={0.05}>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 mb-6">
            <Sparkles className="h-3.5 w-3.5" /> Changelog
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <h1 className="text-display-lg font-bold tracking-tight text-foreground sm:text-display-xl">
            Product Updates
          </h1>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance">
            Follow along with our release updates as we build the hiring ecosystem.
          </p>
        </Reveal>
      </Section>

      {/* Changelog Entries */}
      <Section size="lg" className="bg-slate-50/50 border-t border-border">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Release v0.3.0 */}
          <Card className="bg-white border-border/80 hover:shadow-sm transition-shadow">
            <CardContent className="p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="rounded bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 font-mono">v0.3.0</span>
                  <h3 className="text-base font-bold text-foreground">Marketing Launchpad & Waitlist</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> July 17, 2026
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We have deployed our full marketing presence, legal terms, supporting feature descriptions, and automated email confirmation waitlist routes.
              </p>
              <ul className="list-disc pl-5 text-xs text-muted-foreground space-y-1">
                <li>Dynamic waitlist registration forms with modal overlays.</li>
                <li>Fully typed waitlist API endpoints fetching live social proof counts.</li>
                <li>Comprehensive About, Features, Pricing, and Contact routes.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Release v0.2.0 */}
          <Card className="bg-white border-border/80 hover:shadow-sm transition-shadow">
            <CardContent className="p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="rounded bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 font-mono">v0.2.0</span>
                  <h3 className="text-base font-bold text-foreground">Aventra Design System Components</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> July 16, 2026
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Initial compilation of our design system primitives including buttons, inputs, modals, selectors, avatar cards, and skeleton animations.
              </p>
            </CardContent>
          </Card>

          {/* Release v0.1.0 */}
          <Card className="bg-white border-border/80 hover:shadow-sm transition-shadow">
            <CardContent className="p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="rounded bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 font-mono">v0.1.0</span>
                  <h3 className="text-base font-bold text-foreground">Monorepo Foundation</h3>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" /> July 15, 2026
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Scaffolded our workspace structure using Turborepo. Set up shared types, shared Zod schemas, and Next.js 15 configurations.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>
    </div>
  );
}
