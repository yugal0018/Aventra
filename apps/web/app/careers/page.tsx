"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, MapPin, Briefcase, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal, StaggerGroup } from "@/components/ui/reveal";
import { useToast } from "@/hooks/use-toast";

const MOCK_JOBS = [
  {
    id: "lead-nextjs-dev",
    title: "Lead Frontend Engineer (Next.js)",
    department: "Engineering",
    location: "NYC / Remote",
    type: "Full-Time",
    description: "Lead frontend architecture and compile themed UI primitives for our multi-tenant workspaces."
  },
  {
    id: "sr-product-designer",
    title: "Senior Product Designer (UI/UX)",
    department: "Product",
    location: "Remote",
    type: "Full-Time",
    description: "Own the design system, wireframe persona switcher modules, and ensure premium responsive aesthetics."
  }
];

export default function CareersPage() {
  const { toast } = useToast();

  const handleApplyClick = (jobTitle: string) => {
    toast({
      variant: "info",
      title: "Applications Opening Soon",
      description: `Applications for ${jobTitle} will open alongside our private beta. Please join our waitlist as a candidate!`,
    });
  };

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 bg-indigo-500/5 blur-[100px]" />

      {/* Hero Header */}
      <Section size="lg" className="pt-24 lg:pt-32 text-center max-w-3xl mx-auto">
        <Reveal direction="up" delay={0.05}>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 mb-6">
            <Sparkles className="h-3.5 w-3.5" /> Careers
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <h1 className="text-display-lg font-bold tracking-tight text-foreground sm:text-display-xl">
            Build the future of hiring with us.
          </h1>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance">
            Aventra is building the professional hiring ecosystem for recruiters, companies, and job seekers. Find your next role here.
          </p>
        </Reveal>
      </Section>

      {/* Careers Job Grid */}
      <Section size="lg" className="bg-slate-50/50 border-t border-border">
        <div className="max-w-4xl mx-auto space-y-6">
          <SectionHeader
            eyebrow="Open Roles"
            title="We are hiring in public."
            description="Explore our open requirements and join our team of software architects and product designers."
          />

          <StaggerGroup className="grid gap-6">
            {MOCK_JOBS.map((job) => (
              <Card key={job.id} className="bg-white border-border/80 hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-foreground">{job.title}</h3>
                      <span className="rounded bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-700">{job.department}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                      {job.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-muted-foreground font-semibold">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                      <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" /> {job.type}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleApplyClick(job.title)}
                    className="bg-aventra-500 hover:bg-aventra-600 text-white shrink-0 sm:self-center"
                  >
                    Apply Now
                    <ArrowRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </StaggerGroup>
        </div>
      </Section>
    </div>
  );
}
