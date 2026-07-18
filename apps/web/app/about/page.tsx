"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Users, Globe, Target, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal, StaggerGroup } from "@/components/ui/reveal";

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 bg-indigo-500/5 blur-[100px]" />

      {/* Hero Section */}
      <Section size="lg" className="pt-24 lg:pt-32 text-center max-w-3xl mx-auto">
        <Reveal direction="up" delay={0.05}>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 mb-6">
            <Sparkles className="h-3.5 w-3.5" /> Our Mission
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <h1 className="text-display-lg font-bold tracking-tight text-foreground sm:text-display-xl">
            Re-architecting the professional hiring ecosystem.
          </h1>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance">
            We believe that finding talent should not be a game of chance. Aventra is building a high-trust, unified ecosystem where candidates, recruiters, companies, and placement agencies share a single database of truth.
          </p>
        </Reveal>
      </Section>

      {/* Core Values Section */}
      <Section size="lg" className="bg-slate-50/50 border-t border-border">
        <SectionHeader
          eyebrow="Core Values"
          title="The principles guiding our architecture."
          description="Aventra is built on trust, transparency, and advanced automation."
        />

        <StaggerGroup className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white border-border/80">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Shield className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-foreground">Verified Truth</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We replace bloated resumes with verified credential graphs. No inflation. No false matching.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-border/80">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Globe className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-foreground">Shared Ecosystem</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                By bringing agency recruiters, corporate HR, and talent under one roof, we eliminate feedback lag completely.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-border/80">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Target className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-foreground">Aesthetics & Speed</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We believe business software should be beautiful. We build fast, fluid, and responsive tools that users love.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white border-border/80">
            <CardContent className="p-6 space-y-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Users className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-foreground">Zero-Ghosting</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Aventra automates stage-updates. Candidates are never left in the dark about their application progress.
              </p>
            </CardContent>
          </Card>
        </StaggerGroup>
      </Section>

      {/* Story / Vision Section */}
      <Section size="lg" className="border-t border-border">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="space-y-6 lg:col-span-6">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">The Story</span>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">Why we are building Aventra</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Recruitment is currently locked inside legacy silos. Recruiters pay tens of thousands of dollars to scrape profiles, only to enter them manually into basic spreadsheets. Agencies send cold candidate PDFs to corporations via email, receiving replies weeks later.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We realized that the problem wasn't a lack of talent—it was a lack of a unified hiring platform. We designed Aventra to bridge these divides. Our platform operates as a multi-tenant workspace where corporate companies and agencies coordinate placements seamlessly, with job seekers owning and controlling their profile data.
            </p>
          </div>
          <div className="lg:col-span-6">
            <div className="rounded-2xl border border-border bg-slate-50 p-8 shadow-sm text-center space-y-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-lg">✦</div>
              <h3 className="font-bold text-foreground text-lg">Join us in public</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                We are building Aventra out in the open. Follow our public changelog and roadmap as we compile features and scale our infrastructure.
              </p>
              <div className="pt-2">
                <Button className="bg-aventra-500 hover:bg-aventra-600 text-white" asChild>
                  <Link href="/signup">
                    Request early pass key
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}
