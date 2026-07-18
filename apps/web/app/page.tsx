"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Users,
  Search,
  Briefcase,
  Building,
  Shield,
  Workflow,
  BarChart3,
  TrendingUp,
  Mail,
  Lock,
  ChevronRight,
  Star,
  Check,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Pill } from "@/components/ui/pill";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal, StaggerGroup } from "@/components/ui/reveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { WaitlistRole } from "@aventra/types";

// ============================================================
// AVENTRA LANDING PAGE
// Built for maximum conversion, design excellence, and social proof.
// ============================================================

export default function HomePage() {
  const { toast } = useToast();

  // Waitlist form state
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<WaitlistRole>("CANDIDATE");
  const [isLoading, setIsLoading] = useState(false);

  // Dynamic waitlist count state
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  // Modal control for pricing cards CTA
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch waitlist count for social proof
  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/waitlist");
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data?.count !== undefined) {
            setWaitlistCount(result.data.count);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch live waitlist count:", err);
      }
    }
    void fetchCount();
  }, []);

  // Form submission handler
  const handleJoinWaitlist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, role }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          variant: "success",
          title: "Successfully Joined! 🎉",
          description: data.message || "We've added you to the waitlist and sent a confirmation email.",
        });
        setEmail("");
        setName("");
        setRole("CANDIDATE");
        setIsModalOpen(false); // Close dialog if open
        // Refresh count
        const newCountRes = await fetch("/api/waitlist");
        if (newCountRes.ok) {
          const newCountData = await newCountRes.json();
          if (newCountData.success && newCountData.data?.count !== undefined) {
            setWaitlistCount(newCountData.data.count);
          }
        }
      } else {
        toast({
          variant: "destructive",
          title: data.error || "Submission failed",
          description: data.message || "Please check your details and try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Could not connect to the waitlist server. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Open modal with pre-selected role
  const handlePricingCTA = (selectedRole: WaitlistRole) => {
    setRole(selectedRole);
    setIsModalOpen(true);
  };

  const formattedCount = waitlistCount ? new Intl.NumberFormat().format(waitlistCount) : "2,480";

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Subtle global grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Hero Radial Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 bg-aventra-500/5 blur-[120px]" />

      {/* ==========================================
          1. HERO SECTION
          ========================================== */}
      <Section size="xl" className="pt-24 lg:pt-36">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col items-center text-center lg:col-span-7 lg:items-start lg:text-left">
            <Reveal direction="up" delay={0.05}>
              <Pill variant="aventra" pulseDot className="mb-6">
                Now accepting early access requests
              </Pill>
            </Reveal>

            <Reveal direction="up" delay={0.1}>
              <h1 className="text-display-lg font-bold tracking-tight text-foreground sm:text-display-xl lg:text-[60px] lg:leading-[1.05]">
                The hiring platform your team{" "}
                <span className="aventra-gradient-text">actually wants</span> to use.
              </h1>
            </Reveal>

            <Reveal direction="up" delay={0.15}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
                One unified ecosystem for candidates, recruiters, companies, and placement agencies.
                Built with next-gen intelligence to deliver friction-free talent discovery.
              </p>
            </Reveal>

            {/* Quick Inline Waitlist Form */}
            <Reveal direction="up" delay={0.2} className="w-full">
              <form onSubmit={handleJoinWaitlist} className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row">
                <div className="flex-1">
                  <Label htmlFor="hero-email" className="sr-only">Email address</Label>
                  <Input
                    id="hero-email"
                    type="email"
                    placeholder="Enter your professional email..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 bg-white"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="h-11 bg-aventra-500 text-white hover:bg-aventra-600 aventra-glow shrink-0"
                >
                  {isLoading ? "Joining..." : "Join Waitlist"}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </form>
            </Reveal>

            {/* Social Proof */}
            <Reveal direction="up" delay={0.25}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                <div className="flex -space-x-2">
                  <div className="h-8 w-8 rounded-full border-2 border-background bg-zinc-200 flex items-center justify-center text-xs font-bold text-foreground">A</div>
                  <div className="h-8 w-8 rounded-full border-2 border-background bg-zinc-300 flex items-center justify-center text-xs font-bold text-foreground">S</div>
                  <div className="h-8 w-8 rounded-full border-2 border-background bg-zinc-400 flex items-center justify-center text-xs font-bold text-foreground">M</div>
                  <div className="h-8 w-8 rounded-full border-2 border-background bg-zinc-500 flex items-center justify-center text-xs font-bold text-white">R</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Join <span className="font-semibold text-foreground">{formattedCount}+</span> hiring professionals securing early seats.
                </div>
              </div>
            </Reveal>
          </div>

          {/* Abstract Interactive/Animated Premium CSS Dashboard Visual */}
          <div className="relative lg:col-span-5">
            <Reveal direction="scale" delay={0.3} className="relative mx-auto max-w-[450px] lg:max-w-none">
              <div className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
                {/* Header bar */}
                <div className="flex items-center justify-between border-b border-border bg-slate-50 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400" />
                    <span className="h-3 w-3 rounded-full bg-amber-400" />
                    <span className="h-3 w-3 rounded-full bg-green-400" />
                  </div>
                  <span className="text-[11px] font-mono text-muted-foreground/60 tracking-wider">aventra.io/dashboard</span>
                  <div className="h-4 w-4 rounded-full bg-zinc-200" />
                </div>

                {/* Dashboard body mockup */}
                <div className="p-5 space-y-4 bg-slate-50/50">
                  {/* Summary Metric cards */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-border/80 bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-xs text-muted-foreground">Match Accuracy</span>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-lg font-bold tracking-tight text-foreground font-mono">98.4%</span>
                        <span className="text-[10px] font-semibold text-emerald-600 flex items-center"><TrendingUp className="h-3 w-3 mr-0.5" />+2.1%</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-border/80 bg-white p-3 shadow-sm hover:shadow-md transition-shadow">
                      <span className="text-xs text-muted-foreground">Time to Match</span>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-lg font-bold tracking-tight text-foreground font-mono">1.2d</span>
                        <span className="text-[10px] font-semibold text-aventra-600">Optimal</span>
                      </div>
                    </div>
                  </div>

                  {/* Main activity list */}
                  <div className="rounded-xl border border-border/80 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="text-xs font-semibold text-foreground">Top Candidates matched</span>
                      <span className="text-[10px] text-muted-foreground">Active updates</span>
                    </div>
                    <div className="mt-3 space-y-3">
                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-aventra-100 flex items-center justify-center text-[10px] font-bold text-aventra-700">JD</div>
                          <div>
                            <p className="text-xs font-medium text-foreground">Jane Doe</p>
                            <p className="text-[9px] text-muted-foreground">Senior Next.js Developer</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">97% score</span>
                      </div>
                      <div className="flex items-center justify-between group">
                        <div className="flex items-center gap-2.5">
                          <div className="h-7 w-7 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-700">MA</div>
                          <div>
                            <p className="text-xs font-medium text-foreground">Marcus Aurelius</p>
                            <p className="text-[9px] text-muted-foreground">Full Stack Architect</p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">94% score</span>
                      </div>
                    </div>
                  </div>

                  {/* Visual Graph / Pipeline Preview */}
                  <div className="rounded-xl border border-border/80 bg-white p-4 shadow-sm">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Talent Acquisition Pipeline</span>
                    <div className="mt-3 flex items-center justify-between gap-1.5 h-16">
                      <div className="flex-1 bg-slate-100 rounded-lg p-2 text-center h-full flex flex-col justify-center border-l-2 border-aventra-500">
                        <span className="text-[10px] font-bold font-mono">18</span>
                        <span className="text-[8px] text-muted-foreground">Sourced</span>
                      </div>
                      <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                      <div className="flex-1 bg-slate-100 rounded-lg p-2 text-center h-full flex flex-col justify-center border-l-2 border-amber-500">
                        <span className="text-[10px] font-bold font-mono">8</span>
                        <span className="text-[8px] text-muted-foreground">Screening</span>
                      </div>
                      <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                      <div className="flex-1 bg-slate-100 rounded-lg p-2 text-center h-full flex flex-col justify-center border-l-2 border-emerald-500">
                        <span className="text-[10px] font-bold font-mono">3</span>
                        <span className="text-[8px] text-muted-foreground">Offered</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative floating widgets */}
              <div className="absolute -left-6 bottom-8 animate-float shadow-xl rounded-lg border border-border bg-white p-3 flex items-center gap-2 z-20">
                <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center"><Check className="h-3 w-3 text-emerald-600" /></div>
                <div>
                  <p className="text-[10px] font-bold text-foreground">Candidate Verified</p>
                  <p className="text-[8px] text-muted-foreground">GitHub + LinkedIn verified</p>
                </div>
              </div>
              <div className="absolute -right-6 top-10 animate-float stagger-2 shadow-xl rounded-lg border border-border bg-white p-3 flex items-center gap-2.5 z-20">
                <div className="h-2 w-2 rounded-full bg-aventra-500 animate-pulse" />
                <span className="text-[10px] font-semibold text-foreground">Matched with Stripe</span>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* ==========================================
          2. PROBLEM STATEMENT
          ========================================== */}
      <Section size="lg" className="bg-slate-50/50">
        <SectionHeader
          eyebrow="The Hiring Crisis"
          title="Hiring is broken. It's time for an upgrade."
          description="Legacy portals force recruiters to juggle dozens of disconnected tools while candidates suffer from infinite ghosting. Aventra solves this by providing a single shared ecosystem."
        />

        <StaggerGroup className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-card-hover hover:border-zinc-300">
            <CardContent className="p-8">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-aventra-50 text-aventra-600">
                <Workflow className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Fragmented Tooling</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Recruiters jump between applicant tracking systems, candidate sourcing engines, verification tools, and communication channels. Info gets lost, speed plummets.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card-hover hover:border-zinc-300">
            <CardContent className="p-8">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-600">
                <Mail className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Candidate Black Hole</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Talent spends hours on generic resume forms just to be ghosted by automated parsers. No transparency, no feedback loop, and a degraded brand reputation.
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-card-hover hover:border-zinc-300">
            <CardContent className="p-8">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Agency Disconnection</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                External placement agencies operate in isolation. Relaying feedback, coordinate interviews, and verifying matching criteria takes days of manual email chains.
              </p>
            </CardContent>
          </Card>
        </StaggerGroup>
      </Section>

      {/* ==========================================
          3. PERSONA SWITCHER
          ========================================== */}
      <Section size="lg" className="border-t border-border">
        <SectionHeader
          eyebrow="Dynamic Workflows"
          title="One platform. Tailored experiences."
          description="Select your role to see how Aventra re-imagines talent acquisition for your specific context."
        />

        <Tabs defaultValue="candidate" variant="pills" className="w-full">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="candidate">For Candidates</TabsTrigger>
              <TabsTrigger value="recruiter">For Recruiters</TabsTrigger>
              <TabsTrigger value="company">For Companies</TabsTrigger>
              <TabsTrigger value="agency">For Agencies</TabsTrigger>
            </TabsList>
          </div>

          {/* CANDIDATE FLOW */}
          <TabsContent value="candidate" className="mt-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="space-y-6 lg:col-span-6">
                <h3 className="text-display-sm font-bold text-foreground">Own your career profile.</h3>
                <p className="text-base text-muted-foreground">
                  Build a premium, verified candidate profile once. No more manual form filling. Apply to jobs with one-click, track application milestones in real-time, and get matched algorithmically.
                </p>
                <ul className="space-y-3.5">
                  <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-aventra-500 shrink-0" />
                    Verified Credentials (verified via GitHub, LinkedIn & assessments)
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-aventra-500 shrink-0" />
                    Absolute transparency — know exactly when your resume is reviewed
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-aventra-500 shrink-0" />
                    Algorithmic matchmaking (receive opportunities that match your true skills)
                  </li>
                </ul>
                <div className="pt-2">
                  <Button className="bg-aventra-500 hover:bg-aventra-600 text-white font-medium" onClick={() => handlePricingCTA("CANDIDATE")}>
                    Create Candidate Profile
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-border bg-slate-50 p-6 shadow-md">
                  <div className="rounded-xl bg-white p-5 border border-border shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-aventra-100 flex items-center justify-center font-bold text-aventra-600">JD</div>
                      <div>
                        <h4 className="text-sm font-bold text-foreground">Jane Doe</h4>
                        <p className="text-xs text-muted-foreground font-mono">ID: AV-894732</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">TypeScript</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">Next.js</span>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">PostgreSQL</span>
                    </div>
                    <div className="mt-5 rounded-lg border border-emerald-100 bg-emerald-50/50 p-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-semibold text-emerald-800">Github Verified</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-700">14 Repos checked</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* RECRUITER FLOW */}
          <TabsContent value="recruiter" className="mt-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="space-y-6 lg:col-span-6">
                <h3 className="text-display-sm font-bold text-foreground">Source top talent with super-human efficiency.</h3>
                <p className="text-base text-muted-foreground">
                  Stop parsing cold resumes. Aventra gives you a pre-vetted pool of matching candidates. Set search filters, automate initial screenings, and share candidate digests with hiring managers.
                </p>
                <ul className="space-y-3.5">
                  <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-aventra-500 shrink-0" />
                    Boolean Universal Search with natural language queries
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-aventra-500 shrink-0" />
                    Automated pre-vetting metrics and coding challenge syncs
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-aventra-500 shrink-0" />
                    Direct portal channels to place and schedule interviews instantly
                  </li>
                </ul>
                <div className="pt-2">
                  <Button className="bg-aventra-500 hover:bg-aventra-600 text-white font-medium" onClick={() => handlePricingCTA("RECRUITER")}>
                    Access Recruiter Console
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-border bg-slate-50 p-6 shadow-md">
                  <div className="rounded-xl bg-white p-5 border border-border shadow-sm space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Universal Candidate Search</span>
                      <Search className="h-4 w-4 text-muted-foreground/60" />
                    </div>
                    <div className="relative">
                      <Input disabled placeholder="e.g., Senior React developers in NY with Rust experience..." className="text-xs bg-slate-50/50" />
                    </div>
                    <div className="space-y-2 pt-1">
                      <div className="rounded border border-border bg-slate-50/50 p-2 flex items-center justify-between text-xs">
                        <span>Alex Smith</span>
                        <span className="text-[10px] text-aventra-600 font-bold">94% Match</span>
                      </div>
                      <div className="rounded border border-border bg-slate-50/50 p-2 flex items-center justify-between text-xs">
                        <span>Emma Watson</span>
                        <span className="text-[10px] text-aventra-600 font-bold">89% Match</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* COMPANY FLOW */}
          <TabsContent value="company" className="mt-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="space-y-6 lg:col-span-6">
                <h3 className="text-display-sm font-bold text-foreground">Manage hiring in one complete hub.</h3>
                <p className="text-base text-muted-foreground">
                  Connect your internal hiring managers, HR specialists, and department leads. Publish open listings directly to our candidate ecosystem, coordinate interview pipelines, and manage offers smoothly.
                </p>
                <ul className="space-y-3.5">
                  <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-aventra-500 shrink-0" />
                    Unified employer dashboard with role-based manager access
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-aventra-500 shrink-0" />
                    Seamless ATS integration with custom pipeline creation
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-aventra-500 shrink-0" />
                    Automated feedback aggregation to eliminate ghosting
                  </li>
                </ul>
                <div className="pt-2">
                  <Button className="bg-aventra-500 hover:bg-aventra-600 text-white font-medium" onClick={() => handlePricingCTA("COMPANY")}>
                    Register Company Account
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-border bg-slate-50 p-6 shadow-md">
                  <div className="rounded-xl bg-white p-5 border border-border shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">Corporate Requisitions</span>
                      <span className="rounded bg-indigo-50 px-2 py-0.5 text-[9px] font-semibold text-indigo-700">4 Active</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs p-2.5 rounded-lg border border-border">
                        <div>
                          <p className="font-semibold">Backend Tech Lead</p>
                          <p className="text-[10px] text-muted-foreground">Engineering · NYC</p>
                        </div>
                        <span className="text-[10.5px] font-semibold text-emerald-600">3 new matches</span>
                      </div>
                      <div className="flex justify-between items-center text-xs p-2.5 rounded-lg border border-border">
                        <div>
                          <p className="font-semibold">UI/UX Designer</p>
                          <p className="text-[10px] text-muted-foreground">Product · Remote</p>
                        </div>
                        <span className="text-[10.5px] font-semibold text-muted-foreground">0 new matches</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* AGENCY FLOW */}
          <TabsContent value="agency" className="mt-12">
            <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
              <div className="space-y-6 lg:col-span-6">
                <h3 className="text-display-sm font-bold text-foreground">Operate your placement agency at scale.</h3>
                <p className="text-base text-muted-foreground">
                  Co-operate with target corporations directly inside the ecosystem. Track placement fees, manage client-specific pipelines, and showcase pre-vetted talent directly to employer portals.
                </p>
                <ul className="space-y-3.5">
                  <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-aventra-500 shrink-0" />
                    White-labeled client presentation portals
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-aventra-500 shrink-0" />
                    Inter-organization pipeline sharing (real-time comments & sync)
                  </li>
                  <li className="flex items-center gap-3 text-sm font-medium text-foreground">
                    <CheckCircle2 className="h-5 w-5 text-aventra-500 shrink-0" />
                    Integrated contract administration and fee auditing
                  </li>
                </ul>
                <div className="pt-2">
                  <Button className="bg-aventra-500 hover:bg-aventra-600 text-white font-medium" onClick={() => handlePricingCTA("AGENCY")}>
                    Request Agency License
                  </Button>
                </div>
              </div>
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-border bg-slate-50 p-6 shadow-md">
                  <div className="rounded-xl bg-white p-5 border border-border shadow-sm space-y-4">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <span className="text-xs font-bold text-foreground">Agency Dashboard</span>
                      <span className="text-[10px] text-muted-foreground font-mono">Commission: $48k (Q3)</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs p-2 rounded bg-slate-50">
                        <span>Candidate: Jane Doe</span>
                        <span className="text-muted-foreground">Stripe · Lead Dev</span>
                        <span className="font-semibold text-emerald-600">Offered</span>
                      </div>
                      <div className="flex justify-between items-center text-xs p-2 rounded bg-slate-50">
                        <span>Candidate: Bob Green</span>
                        <span>Linear · Senior PM</span>
                        <span className="font-semibold text-amber-600">Interviewing</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Section>

      {/* ==========================================
          4. BENTO GRID FEATURES
          ========================================== */}
      <Section size="lg" className="bg-slate-50/30 border-t border-border">
        <SectionHeader
          eyebrow="Key Offerings"
          title="Designed for high-impact hiring teams."
          description="Everything you need to source, verify, match, and hire top-tier professionals."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {/* Large Card 1 */}
          <Card className="md:col-span-2 hover:shadow-card-hover hover:border-zinc-300 transition-all duration-200">
            <CardContent className="p-8 flex flex-col justify-between h-full min-h-[300px]">
              <div>
                <Pill variant="aventra" className="mb-4">Intelligence</Pill>
                <h3 className="text-2xl font-bold text-foreground">Smart Match Engine</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-xl">
                  Aventra maps candidate credentials, projects, and work history semantically against role criteria. It doesn't look for keyword matches; it understands developer competence.
                </p>
              </div>
              <div className="mt-6 border border-border/80 rounded-xl bg-white p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded bg-indigo-50 flex items-center justify-center font-bold text-aventra-600 text-xs">Node</div>
                  <div>
                    <p className="text-xs font-bold">Node.js API Specialist</p>
                    <p className="text-[9px] text-muted-foreground">Match accuracy requirements</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-bold text-foreground font-mono">98% match</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Small Card 2 */}
          <Card className="hover:shadow-card-hover hover:border-zinc-300 transition-all duration-200">
            <CardContent className="p-8 flex flex-col justify-between h-full min-h-[300px]">
              <div>
                <Pill variant="default" className="mb-4">Security</Pill>
                <h3 className="text-xl font-bold text-foreground">Verified Profiles</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Credentials verified cryptographically at the source. Eliminate resume inflation.
                </p>
              </div>
              <div className="mt-6 flex justify-center py-2 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 rounded-full px-3 py-1">
                  <Shield className="h-3.5 w-3.5 text-emerald-600" />
                  ID Verified
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Small Card 3 */}
          <Card className="hover:shadow-card-hover hover:border-zinc-300 transition-all duration-200">
            <CardContent className="p-8 flex flex-col justify-between h-full min-h-[300px]">
              <div>
                <Pill variant="default" className="mb-4">ATS</Pill>
                <h3 className="text-xl font-bold text-foreground">Modern Kanban</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                  Track hiring stages. Visual kanban board tracks candidate applications with zero friction.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-around h-12 border border-border rounded-lg p-2 bg-white">
                <span className="h-3 w-3 rounded-full bg-slate-200" />
                <span className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse" />
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
            </CardContent>
          </Card>

          {/* Large Card 4 */}
          <Card className="md:col-span-2 hover:shadow-card-hover hover:border-zinc-300 transition-all duration-200">
            <CardContent className="p-8 flex flex-col justify-between h-full min-h-[300px]">
              <div>
                <Pill variant="aventra" className="mb-4">Collaboration</Pill>
                <h3 className="text-2xl font-bold text-foreground">Agency-Employer Portals</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground max-w-xl">
                  Allow placement agencies to suggest candidates, log feedback, and coordinate directly with employer representatives. Clean transparency ends the endless email back-and-forth.
                </p>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-xs font-semibold text-muted-foreground">
                <div className="p-3 bg-white border border-border/80 rounded-xl flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  Real-time pipeline syncing
                </div>
                <div className="p-3 bg-white border border-border/80 rounded-xl flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-indigo-500" />
                  Placement fee logs
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ==========================================
          5. HOW IT WORKS
          ========================================== */}
      <Section size="lg" className="border-t border-border">
        <SectionHeader
          eyebrow="Workflow"
          title="From listing to onboarding in three steps."
          description="How Aventra accelerates your talent acquisition pipeline."
        />

        <StaggerGroup className="grid gap-8 md:grid-cols-3">
          <div className="relative space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-aventra-500 text-white font-bold font-mono shadow-md">1</div>
            <h3 className="text-lg font-bold text-foreground">Sync your parameters</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Candidates submit verified profiles; companies and agencies sync job requisitions and talent parameters.
            </p>
          </div>

          <div className="relative space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-aventra-500 text-white font-bold font-mono shadow-md">2</div>
            <h3 className="text-lg font-bold text-foreground">Intelligent matchmaking</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Our semantic matching algorithm processes credentials and scores candidates, alerting both parties to optimal matches.
            </p>
          </div>

          <div className="relative space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-aventra-500 text-white font-bold font-mono shadow-md">3</div>
            <h3 className="text-lg font-bold text-foreground">Close in one portal</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Coordinate interviews, check reference audits, offer, and finalize placements in one unified workspace.
            </p>
          </div>
        </StaggerGroup>
      </Section>

      {/* ==========================================
          6. PRICING PREVIEW
          ========================================== */}
      <Section size="lg" className="bg-slate-50/50 border-t border-border">
        <SectionHeader
          eyebrow="Pricing Model"
          title="Scalable plans for growing teams."
          description="Simple tiers built for candidates, small projects, independent recruiters, and enterprise agencies."
        />

        <div className="grid gap-6 md:grid-cols-4">
          {/* Card 1: Free */}
          <Card className="hover:shadow-card-hover border-border transition-all flex flex-col justify-between">
            <div className="p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Free</span>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-extrabold text-foreground font-mono">$0</span>
                <span className="ml-1 text-sm text-muted-foreground">/ forever</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Ideal for candidates building verified profiles.</p>
              <div className="mt-6 border-t border-border/60 pt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Premium Profile
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Apply to 5 jobs / mo
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Basic credentials
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <Button variant="outline" className="w-full text-xs font-semibold" onClick={() => handlePricingCTA("CANDIDATE")}>
                Create Free Profile
              </Button>
            </div>
          </Card>

          {/* Card 2: Starter */}
          <Card className="hover:shadow-card-hover border-border transition-all flex flex-col justify-between">
            <div className="p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Starter</span>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-extrabold text-foreground font-mono">$29</span>
                <span className="ml-1 text-sm text-muted-foreground">/ month</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">For independent recruiters finding specialized roles.</p>
              <div className="mt-6 border-t border-border/60 pt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> 10 active job listings
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Basic talent search
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Direct candidates communication
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <Button variant="outline" className="w-full text-xs font-semibold" onClick={() => handlePricingCTA("RECRUITER")}>
                Select Starter Plan
              </Button>
            </div>
          </Card>

          {/* Card 3: Growth */}
          <Card className="hover:shadow-card-hover border-aventra-300 shadow-sm relative transition-all flex flex-col justify-between">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-aventra-500 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">Most Popular</span>
            </div>
            <div className="p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-aventra-600">Growth</span>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-extrabold text-foreground font-mono">$99</span>
                <span className="ml-1 text-sm text-muted-foreground">/ month</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">For growing corporate teams scaling operations.</p>
              <div className="mt-6 border-t border-border/60 pt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Unlimited listings
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Advanced Semantic search
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Team workspaces (5 seats)
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Advanced analytics
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <Button className="w-full text-xs font-semibold bg-aventra-500 text-white hover:bg-aventra-600 shadow" onClick={() => handlePricingCTA("COMPANY")}>
                Get Growth Plan
              </Button>
            </div>
          </Card>

          {/* Card 4: Enterprise */}
          <Card className="hover:shadow-card-hover border-border transition-all flex flex-col justify-between">
            <div className="p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Enterprise</span>
              <div className="mt-3 flex items-baseline">
                <span className="text-2xl font-extrabold text-foreground font-mono">Custom</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">For professional agencies requiring tailored compliance.</p>
              <div className="mt-6 border-t border-border/60 pt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Full ATS integration
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Shared Partner portals
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Dedicated Account Manager
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Custom branding & API Access
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <Button variant="outline" className="w-full text-xs font-semibold" onClick={() => handlePricingCTA("AGENCY")}>
                Contact Sales
              </Button>
            </div>
          </Card>
        </div>
      </Section>

      {/* ==========================================
          7. TESTIMONIALS
          ========================================== */}
      <Section size="lg" className="border-t border-border">
        <SectionHeader
          eyebrow="Reviews"
          title="What recruitment leaders are saying."
          description="Early beta testers report dramatic speed-to-hire improvements and complete toolset integration."
        />

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                "Aventra's shared portal completely changed how we coordinate with corporate clients. We no longer write daily update emails. Our placements are down to under a week."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-[10px]">TH</div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Thomas H.</h4>
                  <p className="text-[10px] text-muted-foreground">Founder, Elite Placements</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                "As a candidate, I was skeptical of yet another portal. But Aventra's verified profiles mean I filled out details once and got matched to real open roles immediately."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-[10px]">SC</div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Sarah C.</h4>
                  <p className="text-[10px] text-muted-foreground">Staff Engineer, HireMatch</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                "We replaced three separate recruitment platforms with Aventra. Sourcing, screening, and interview logging are fully streamlined. Saving us thousands monthly."
              </p>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-zinc-200 flex items-center justify-center font-bold text-[10px]">MA</div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Michael A.</h4>
                  <p className="text-[10px] text-muted-foreground">Head of HR, Vercel-backed Startups</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ==========================================
          8. WAITLIST CTA (INDIGO GRADIENT)
          ========================================== */}
      <Section size="lg" className="bg-background border-t border-border">
        <div className="relative overflow-hidden rounded-3xl border border-aventra-200 bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-600 px-6 py-16 text-center shadow-xl sm:px-12 sm:py-20">
          <div className="relative z-10 mx-auto max-w-2xl space-y-6">
            <span className="rounded-full bg-white/10 px-3.5 py-1 text-xs font-semibold text-white uppercase tracking-wider">Early Seat Pass</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl text-balance">
              Secure your early access to Aventra today.
            </h2>
            <p className="text-base text-indigo-100 max-w-lg mx-auto text-balance">
              The hiring ecosystem is entering a new era. Secure your priority invite, customize your profile parameters, and prepare to scale your hiring.
            </p>

            <form onSubmit={handleJoinWaitlist} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter professional email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 h-11 focus-visible:ring-white"
                />
              </div>
              <Button type="submit" size="lg" disabled={isLoading} className="bg-white text-indigo-600 hover:bg-indigo-50 shrink-0 h-11">
                {isLoading ? "Signing up..." : "Request Access"}
                <ArrowRight className="ml-1.5 h-4 w-4 text-indigo-600" />
              </Button>
            </form>
            <p className="text-[11px] text-indigo-200">No credit card. No long-term commitments. Launching Q4 2026.</p>
          </div>

          {/* Background shapes */}
          <div className="absolute right-0 top-0 -translate-y-12 translate-x-12 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
          <div className="absolute left-0 bottom-0 translate-y-12 -translate-x-12 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />
        </div>
      </Section>

      {/* ==========================================
          DYNAMIC WAITLIST SIGNUP DIALOG
          ========================================== */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Aventra Waitlist</DialogTitle>
            <DialogDescription>
              Provide your details and we will pre-select the appropriate plan level when access opens.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleJoinWaitlist} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label htmlFor="modal-name">Your Full Name</Label>
              <Input
                id="modal-name"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="modal-email">Professional Email</Label>
              <Input
                id="modal-email"
                type="email"
                placeholder="jane@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="modal-role">Select your Role</Label>
              <Select value={role} onValueChange={(val) => setRole(val as WaitlistRole)}>
                <SelectTrigger id="modal-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CANDIDATE">Candidate / Job Seeker</SelectItem>
                  <SelectItem value="RECRUITER">Independent Recruiter</SelectItem>
                  <SelectItem value="COMPANY">Company Hiring Team</SelectItem>
                  <SelectItem value="AGENCY">Placement Agency</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-aventra-500 text-white hover:bg-aventra-600">
                {isLoading ? "Submitting..." : "Join Waitlist"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
