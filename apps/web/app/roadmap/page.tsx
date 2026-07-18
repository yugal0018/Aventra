"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Calendar, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal, StaggerGroup } from "@/components/ui/reveal";

export default function RoadmapPage() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 bg-indigo-500/5 blur-[100px]" />

      {/* Hero Header */}
      <Section size="lg" className="pt-24 lg:pt-32 text-center max-w-3xl mx-auto">
        <Reveal direction="up" delay={0.05}>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 mb-6">
            <Sparkles className="h-3.5 w-3.5" /> Product Roadmap
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <h1 className="text-display-lg font-bold tracking-tight text-foreground sm:text-display-xl">
            Where we are headed.
          </h1>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance">
            Our vision is to build the ultimate hiring ecosystem. Here is our public roadmap outlining current priorities.
          </p>
        </Reveal>
      </Section>

      {/* Roadmap Timeline */}
      <Section size="lg" className="bg-slate-50/50 border-t border-border">
        <div className="max-w-4xl mx-auto space-y-12 relative">
          {/* Central Line for timeline layout on desktop */}
          <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-border md:left-1/2 md:-translate-x-0.5" />

          {/* Phase 1: Completed */}
          <div className="relative grid gap-6 md:grid-cols-2 md:gap-12">
            <div className="flex items-center md:justify-end">
              <div className="absolute left-6 h-4 w-4 rounded-full border-4 border-emerald-500 bg-white md:left-1/2 md:-translate-x-2 z-10" />
              <div className="pl-12 md:pl-0 md:pr-8 md:text-right">
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Released</span>
                <h3 className="text-lg font-bold text-foreground mt-1">Phase 1: Brand & Foundation</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">Q3 2026</p>
              </div>
            </div>
            <Card className="bg-white border-border/80 ml-12 md:ml-0 hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Initial monorepo and packages configuration
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Design system variables and themed UI components
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Waitlist capture API routes and landing pages
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Phase 2: In Progress */}
          <div className="relative grid gap-6 md:grid-cols-2 md:gap-12">
            {/* Desktop layout switches sides: content card on left, label on right */}
            <div className="md:order-2 flex items-center">
              <div className="absolute left-6 h-4 w-4 rounded-full border-4 border-indigo-500 bg-white md:left-1/2 md:-translate-x-2 z-10" />
              <div className="pl-12 md:pl-8">
                <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-700">In Progress</span>
                <h3 className="text-lg font-bold text-foreground mt-1">Phase 2: Platform Console Beta</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">Q4 2026</p>
              </div>
            </div>
            <Card className="bg-white border-border/80 ml-12 md:ml-0 md:order-1 hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />
                  Candidate profile builder and credential sync
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />
                  Boolean talent sourcing engine for recruiters
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                  <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse shrink-0" />
                  Email passcode login and priority allocations
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Phase 3: Planned */}
          <div className="relative grid gap-6 md:grid-cols-2 md:gap-12">
            <div className="flex items-center md:justify-end">
              <div className="absolute left-6 h-4 w-4 rounded-full border-4 border-slate-300 bg-white md:left-1/2 md:-translate-x-2 z-10" />
              <div className="pl-12 md:pl-0 md:pr-8 md:text-right">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">Planned</span>
                <h3 className="text-lg font-bold text-foreground mt-1">Phase 3: ATS & Agency Sync</h3>
                <p className="text-xs text-muted-foreground mt-1 font-mono">Q1 2027</p>
              </div>
            </div>
            <Card className="bg-white border-border/80 ml-12 md:ml-0 hover:shadow-md transition-shadow">
              <CardContent className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground/60">
                  • White-labeled placement agency portals
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground/60">
                  • Inter-organization scorecard comments and scheduling
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground/60">
                  • Full billing integration (automated placement fees)
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}
