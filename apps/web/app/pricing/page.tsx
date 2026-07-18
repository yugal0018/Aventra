"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Check, X, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal, StaggerGroup } from "@/components/ui/reveal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { WaitlistRole } from "@aventra/types";

// ============================================================
// PRICING PAGE — Premium plans + comparison table
// ============================================================

export default function PricingPage() {
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<WaitlistRole>("CANDIDATE");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePricingCTA = (selectedRole: WaitlistRole) => {
    setRole(selectedRole);
    setIsModalOpen(true);
  };

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
          title: "Registration successful! 🎉",
          description: "We have saved your preference.",
        });
        setEmail("");
        setName("");
        setIsModalOpen(false);
      } else {
        toast({
          variant: "destructive",
          title: data.error || "Submission failed",
          description: data.message || "Please check your inputs.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 bg-indigo-500/5 blur-[100px]" />

      {/* Hero Header */}
      <Section size="lg" className="pt-24 lg:pt-32 text-center max-w-3xl mx-auto">
        <Reveal direction="up" delay={0.05}>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 mb-6">
            <Sparkles className="h-3.5 w-3.5" /> Pricing
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <h1 className="text-display-lg font-bold tracking-tight text-foreground sm:text-display-xl">
            Clean pricing. No hidden fees.
          </h1>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance">
            Choose the plan tier that aligns with your scale. Select a tier below to register your priority pass.
          </p>
        </Reveal>
      </Section>

      {/* Pricing Cards Grid */}
      <Section size="lg" className="bg-slate-50/50 border-t border-border">
        <div className="grid gap-6 md:grid-cols-4">
          {/* Plan 1: Free */}
          <Card className="bg-white border-border/80 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Free</span>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-extrabold text-foreground font-mono">$0</span>
                <span className="ml-1 text-sm text-muted-foreground">/ forever</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">For candidates building verified profiles.</p>
              <div className="mt-6 border-t border-border/60 pt-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Premium Profile Link
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Apply to 5 jobs / mo
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Basic credential graph
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <Button variant="outline" className="w-full text-xs font-semibold" onClick={() => handlePricingCTA("CANDIDATE")}>
                Create Free Profile
              </Button>
            </div>
          </Card>

          {/* Plan 2: Starter */}
          <Card className="bg-white border-border/80 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Starter</span>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-extrabold text-foreground font-mono">$29</span>
                <span className="ml-1 text-sm text-muted-foreground">/ month</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">For independent recruiters managing candidate pools.</p>
              <div className="mt-6 border-t border-border/60 pt-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> 10 active job listings
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Basic talent sourcing filter
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Live applicant chat console
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <Button variant="outline" className="w-full text-xs font-semibold" onClick={() => handlePricingCTA("RECRUITER")}>
                Select Starter Plan
              </Button>
            </div>
          </Card>

          {/* Plan 3: Growth */}
          <Card className="bg-white border-aventra-300 shadow-sm relative flex flex-col justify-between hover:shadow-md transition-all">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-aventra-500 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-wider">Most Popular</span>
            </div>
            <div className="p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-aventra-600">Growth</span>
              <div className="mt-3 flex items-baseline">
                <span className="text-3xl font-extrabold text-foreground font-mono">$99</span>
                <span className="ml-1 text-sm text-muted-foreground">/ month</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">For corporate teams building hiring pipelines.</p>
              <div className="mt-6 border-t border-border/60 pt-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Unlimited job listings
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Advanced Semantic sourcing
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Team workspaces (5 seats)
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Advanced pipeline analytics
                </div>
              </div>
            </div>
            <div className="p-6 pt-0">
              <Button className="w-full text-xs font-semibold bg-aventra-500 text-white hover:bg-aventra-600 shadow" onClick={() => handlePricingCTA("COMPANY")}>
                Get Growth Plan
              </Button>
            </div>
          </Card>

          {/* Plan 4: Enterprise */}
          <Card className="bg-white border-border/80 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="p-6">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Enterprise</span>
              <div className="mt-3 flex items-baseline">
                <span className="text-2xl font-extrabold text-foreground font-mono">Custom</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">For professional agencies scaling candidate outputs.</p>
              <div className="mt-6 border-t border-border/60 pt-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Full ATS integration
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Shared Agency-Employer portals
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground font-semibold">
                  <Check className="h-3.5 w-3.5 text-aventra-500" /> Custom branding & domain mapping
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

      {/* Feature Comparison Matrix */}
      <Section size="lg" className="border-t border-border">
        <SectionHeader
          eyebrow="Comparison"
          title="Plan Feature Matrix"
          description="Detailed breakdown of capabilities across all Aventra plans."
        />

        <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-sm text-foreground">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                <th className="p-4 font-semibold">Features</th>
                <th className="p-4 font-semibold text-muted-foreground">Free</th>
                <th className="p-4 font-semibold text-muted-foreground">Starter</th>
                <th className="p-4 font-semibold text-indigo-600">Growth</th>
                <th className="p-4 font-semibold text-muted-foreground">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {/* Feature Row 1 */}
              <tr className="border-b border-border/60">
                <td className="p-4 font-medium">Active Job Listings</td>
                <td className="p-4 text-muted-foreground">—</td>
                <td className="p-4">10 listings</td>
                <td className="p-4 font-semibold text-indigo-600">Unlimited</td>
                <td className="p-4">Unlimited</td>
              </tr>
              {/* Feature Row 2 */}
              <tr className="border-b border-border/60">
                <td className="p-4 font-medium">Talent Sourcing Search</td>
                <td className="p-4 text-muted-foreground">—</td>
                <td className="p-4">Basic Boolean</td>
                <td className="p-4 font-semibold text-indigo-600">Advanced Semantic</td>
                <td className="p-4">Full matching logic</td>
              </tr>
              {/* Feature Row 3 */}
              <tr className="border-b border-border/60">
                <td className="p-4 font-medium">Team Seats</td>
                <td className="p-4">1 seat</td>
                <td className="p-4">1 seat</td>
                <td className="p-4 font-semibold text-indigo-600">5 seats</td>
                <td className="p-4">Custom</td>
              </tr>
              {/* Feature Row 4 */}
              <tr className="border-b border-border/60">
                <td className="p-4 font-medium">Draggable Kanban ATS</td>
                <td className="p-4 text-muted-foreground"><X className="h-4 w-4 text-red-400" /></td>
                <td className="p-4"><Check className="h-4 w-4 text-indigo-500" /></td>
                <td className="p-4"><Check className="h-4 w-4 text-indigo-500" /></td>
                <td className="p-4"><Check className="h-4 w-4 text-indigo-500" /></td>
              </tr>
              {/* Feature Row 5 */}
              <tr className="border-b border-border/60">
                <td className="p-4 font-medium">Shared Client Portals</td>
                <td className="p-4 text-muted-foreground"><X className="h-4 w-4 text-red-400" /></td>
                <td className="p-4 text-muted-foreground"><X className="h-4 w-4 text-red-400" /></td>
                <td className="p-4 text-muted-foreground"><X className="h-4 w-4 text-red-400" /></td>
                <td className="p-4"><Check className="h-4 w-4 text-indigo-500" /></td>
              </tr>
              {/* Feature Row 6 */}
              <tr className="border-b border-border/60">
                <td className="p-4 font-medium">API Access & Custom Branding</td>
                <td className="p-4 text-muted-foreground"><X className="h-4 w-4 text-red-400" /></td>
                <td className="p-4 text-muted-foreground"><X className="h-4 w-4 text-red-400" /></td>
                <td className="p-4 text-muted-foreground"><X className="h-4 w-4 text-red-400" /></td>
                <td className="p-4"><Check className="h-4 w-4 text-indigo-500" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      {/* Dialog signup */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join Waitlist & Lock in Plan Tier</DialogTitle>
            <DialogDescription>
              We'll record your plan interest and queue your request for early beta passcodes.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleJoinWaitlist} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label htmlFor="modal-name">Full Name</Label>
              <Input
                id="modal-name"
                placeholder="Enter name"
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
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="modal-role">Pre-selected Plan Category</Label>
              <Select value={role} onValueChange={(val) => setRole(val as WaitlistRole)}>
                <SelectTrigger id="modal-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CANDIDATE">Free Profile (Candidate)</SelectItem>
                  <SelectItem value="RECRUITER">Starter Plan (Recruiter)</SelectItem>
                  <SelectItem value="COMPANY">Growth Plan (Corporate Team)</SelectItem>
                  <SelectItem value="AGENCY">Enterprise Plan (Placement Agency)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-aventra-500 text-white hover:bg-aventra-600">
                {isLoading ? "Locking in Plan..." : "Submit Pass Request"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
