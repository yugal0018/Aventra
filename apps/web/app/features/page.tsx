"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Check, Shield, Search, Workflow, Users, Activity, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal, StaggerGroup } from "@/components/ui/reveal";

export default function FeaturesPage() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 bg-indigo-500/5 blur-[100px]" />

      {/* Hero Section */}
      <Section size="lg" className="pt-24 lg:pt-32 text-center max-w-3xl mx-auto">
        <Reveal direction="up" delay={0.05}>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 mb-6">
            <Sparkles className="h-3.5 w-3.5" /> Product Matrix
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <h1 className="text-display-lg font-bold tracking-tight text-foreground sm:text-display-xl">
            Features engineered for high-velocity hiring.
          </h1>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance">
            Aventra brings advanced semantic analysis, unified pipelines, and partner verification workspaces together into a single, cohesive dashboard.
          </p>
        </Reveal>
      </Section>

      {/* Comprehensive Features Grid */}
      <Section size="lg" className="bg-slate-50/50 border-t border-border">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Candidates Console */}
          <Card className="bg-white border-border/80 hover:shadow-md transition-shadow">
            <CardContent className="p-8 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Candidate Career Hub</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Take control of your professional identity. Build a single verified credential profile that maps directly to employer searches without manual formatting.
              </p>
              <ul className="space-y-2.5 pt-2">
                <li className="flex items-start gap-2.5 text-xs font-semibold text-foreground">
                  <Check className="h-4 w-4 text-aventra-500 shrink-0 mt-0.5" />
                  Cryptographic verification of degree & workplace history
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-foreground">
                  <Check className="h-4 w-4 text-aventra-500 shrink-0 mt-0.5" />
                  Live application tracking (exact state visibility, no ghosting)
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-foreground">
                  <Check className="h-4 w-4 text-aventra-500 shrink-0 mt-0.5" />
                  Profile privacy control (opt-in sourcing requests)
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Recruiters Console */}
          <Card className="bg-white border-border/80 hover:shadow-md transition-shadow">
            <CardContent className="p-8 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Search className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Universal Candidate Sourcing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Stop managing candidate pipelines in siloed platforms. Query verified, active profiles using natural language filters.
              </p>
              <ul className="space-y-2.5 pt-2">
                <li className="flex items-start gap-2.5 text-xs font-semibold text-foreground">
                  <Check className="h-4 w-4 text-aventra-500 shrink-0 mt-0.5" />
                  Natural language search filters (semantic competence scoring)
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-foreground">
                  <Check className="h-4 w-4 text-aventra-500 shrink-0 mt-0.5" />
                  Talent pools segment tagging and outreach logs
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-foreground">
                  <Check className="h-4 w-4 text-aventra-500 shrink-0 mt-0.5" />
                  Integrated interview coordination and scheduler sync
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Companies ATS */}
          <Card className="bg-white border-border/80 hover:shadow-md transition-shadow">
            <CardContent className="p-8 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Workflow className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Next-Gen Applicant Tracking (ATS)</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Manage job openings and candidates in a fast, collaborative kanban board. Share ratings and aggregate hiring manager opinions instantly.
              </p>
              <ul className="space-y-2.5 pt-2">
                <li className="flex items-start gap-2.5 text-xs font-semibold text-foreground">
                  <Check className="h-4 w-4 text-aventra-500 shrink-0 mt-0.5" />
                  Draggable pipeline boards with custom workflow milestones
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-foreground">
                  <Check className="h-4 w-4 text-aventra-500 shrink-0 mt-0.5" />
                  Collaborative scorecards and feedback logs for interviewers
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-foreground">
                  <Check className="h-4 w-4 text-aventra-500 shrink-0 mt-0.5" />
                  Ecosystem syndication (publish to main job boards in one click)
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Agencies Workspace */}
          <Card className="bg-white border-border/80 hover:shadow-md transition-shadow">
            <CardContent className="p-8 space-y-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Activity className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Agency-Employer Shared Portals</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Unlock collaborative placement channels. Share candidate dossiers directly to client corporate ATS spaces and track candidate progress instantly.
              </p>
              <ul className="space-y-2.5 pt-2">
                <li className="flex items-start gap-2.5 text-xs font-semibold text-foreground">
                  <Check className="h-4 w-4 text-aventra-500 shrink-0 mt-0.5" />
                  Shared review channels with feedback alerts
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-foreground">
                  <Check className="h-4 w-4 text-aventra-500 shrink-0 mt-0.5" />
                  Placement commission logs and billing metrics
                </li>
                <li className="flex items-start gap-2.5 text-xs font-semibold text-foreground">
                  <Check className="h-4 w-4 text-aventra-500 shrink-0 mt-0.5" />
                  Agency branding presentation consoles
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* CTA Section */}
      <Section size="lg" className="border-t border-border text-center">
        <Reveal direction="up" className="max-w-xl mx-auto space-y-6">
          <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Ready to streamline your talent workflows?</h2>
          <p className="text-sm text-muted-foreground">
            Join the waitlist to receive your invitation credentials when early beta consoles open.
          </p>
          <div className="pt-2">
            <Button className="bg-aventra-500 hover:bg-aventra-600 text-white font-medium" asChild>
              <Link href="/signup">
                Request Early Pass
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}
