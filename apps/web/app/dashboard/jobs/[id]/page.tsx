"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, MapPin, Briefcase, DollarSign, Calendar, ShieldCheck, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonText } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function JobDetailsPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { id } = useParams() as { id: string };

  const [job, setJob] = useState<any>(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [match, setMatch] = useState<any>(null);

  // Load details and check existing application status
  useEffect(() => {
    async function loadJobDetails() {
      try {
        // Fetch job parameters
        const detailRes = await fetch(`/api/jobs/${id}`);
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          if (detailData?.success && detailData?.data) {
            setJob(detailData.data);
          }
        }

        // Fetch user applications log to check if already applied
        const appsRes = await fetch("/api/applications");
        if (appsRes.ok) {
          const appsData = await appsRes.json();
          if (appsData?.success && appsData?.data) {
            const match = appsData.data.some((app: any) => app.jobId === id);
            setHasApplied(match);
          }
        }

        // Fetch matching details
        const matchesRes = await fetch("/api/jobs/matches");
        if (matchesRes.ok) {
          const matchesData = await matchesRes.json();
          if (matchesData?.success && matchesData?.data) {
            const found = matchesData.data.find((m: any) => m.job.id === id);
            if (found) {
              setMatch(found.match);
            }
          }
        }
      } catch (err) {
        console.error("Failed to load opportunity details:", err);
      } finally {
        setIsFetching(false);
      }
    }
    void loadJobDetails();
  }, [id]);

  const handleApplyAction = async () => {
    setIsApplying(true);
    try {
      const response = await fetch(`/api/jobs/${id}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          variant: "success",
          title: "Application Submitted! 🚀",
          description: data.message || "Your profile has been forwarded to the recruiter pipeline.",
        });
        setHasApplied(true);
        // Redirect candidate to submissions tracker
        router.push("/dashboard/applications");
      } else {
        toast({
          variant: "destructive",
          title: data.error || "Submission failed",
          description: data.message || "Failed to submit application. Please try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Failed to connect to application server. Please try again.",
      });
    } finally {
      setIsApplying(false);
    }
  };

  if (isFetching) {
    return (
      <div className="space-y-6 pt-4">
        <div className="max-w-3xl">
          <SkeletonText lines={10} />
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="space-y-6 pt-4 text-center select-none">
        <ArrowLeft className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-foreground">Listing not found</h3>
        <Button asChild variant="outline" className="mt-4 bg-white">
          <Link href="/dashboard/jobs">Return to Feed</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-2 select-none">
      {/* Return link */}
      <Link
        href="/dashboard/jobs"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </Link>

      <div className="grid gap-6 lg:grid-cols-12 items-start max-w-5xl">
        {/* Left column: Job Specifications */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="bg-white border-border shadow-sm">
            <CardHeader className="p-6 md:p-8 border-b border-slate-100">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-aventra-600 uppercase tracking-wider font-mono">
                  {job.department || "Engineering"}
                </span>
                <CardTitle className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                  {job.title}
                </CardTitle>
                <div className="text-xs text-muted-foreground font-semibold">
                  {job.company?.name} • <a href={job.company?.website} target="_blank" rel="noopener noreferrer" className="text-aventra-600 hover:underline">{job.company?.website?.replace("https://", "")}</a>
                </div>
              </div>

              {/* Param Grid */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><MapPin className="h-4 w-4" /></div>
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider leading-none">Location</p>
                    <p className="font-bold text-foreground mt-0.5 leading-none">{job.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><Briefcase className="h-4 w-4" /></div>
                  <div>
                    <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider leading-none">Commitment</p>
                    <p className="font-bold text-foreground mt-0.5 leading-none">{job.type}</p>
                  </div>
                </div>

                {(job.salaryMin || job.salaryMax) && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 shrink-0"><DollarSign className="h-4 w-4" /></div>
                    <div>
                      <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider leading-none">Salary Bounds</p>
                      <p className="font-bold text-foreground mt-0.5 leading-none">
                        {job.salaryMin ? `$${(job.salaryMin / 1000).toFixed(0)}k` : "Open"}
                        {job.salaryMax ? ` - $${(job.salaryMax / 1000).toFixed(0)}k` : ""}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 md:p-8 space-y-6">
              {/* Job description section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Role Overview</h3>
                <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {job.description}
                </p>
              </div>

              {/* Responsibilities mock markup */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Responsibilities</h3>
                <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-2 leading-relaxed">
                  <li>Engineering responsive components and integrating design tokens seamlessly.</li>
                  <li>Collaborating with product leads to scope visual mockups and state transitions.</li>
                  <li>Ensuring high performance, speed, and accessibility parameters (Aventra Core standards).</li>
                </ul>
              </div>

              {/* Benefits mock markup */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">Perks & Benefits</h3>
                <ul className="list-disc pl-4 text-xs text-muted-foreground space-y-2 leading-relaxed">
                  <li>Comprehensive medical, dental, and vision health coverage.</li>
                  <li>Flexible workspace allowance (Fully Remote, Hybrid options).</li>
                  <li>Unlimited paid vacation days and annual learning parameters budgets.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Sticky Application Action Card */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 space-y-6">
            {/* AI Match Assessment Card */}
            {match && (
              <Card className="bg-white border-border shadow-sm">
                <CardHeader className="p-5 pb-3 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-1.5 text-indigo-700">
                    <Sparkles className="h-4 w-4 shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">AI Match Assessment</span>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-4 text-xs">
                  {/* Verdict & Score */}
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-slate-800 leading-none">{match.verdict}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 font-semibold leading-none font-mono">SCORING COMPATIBILITY</p>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold">
                      {match.score}% Score
                    </div>
                  </div>

                  {/* Explanation text */}
                  <p className="text-muted-foreground leading-relaxed text-[10px] bg-indigo-50/10 p-3 rounded-lg border border-indigo-100/40">
                    {match.explanation}
                  </p>

                  {/* Skills lists */}
                  <div className="space-y-3 pt-1">
                    {/* Matching skills */}
                    {match.matchedSkills.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">Matching Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {match.matchedSkills.map((skill: string) => (
                            <span key={skill} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
                              ✔ {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Missing skills */}
                    {match.missingSkills.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[9px] font-bold text-amber-700 uppercase tracking-wider">Missing Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {match.missingSkills.map((skill: string) => (
                            <span key={skill} className="rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-700">
                              • {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Improvement Recommendations */}
                  {match.recommendations.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[9px] font-bold text-slate-800 uppercase tracking-wider">Improve Your Score</p>
                      <ul className="space-y-1 text-[10px] text-muted-foreground leading-relaxed">
                        {match.recommendations.map((rec: string, index: number) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-indigo-500 font-bold shrink-0">+</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="bg-white border-border shadow-sm">
              <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2">
                <Sparkles className="h-4.5 w-4.5 text-indigo-500 shrink-0" />
                <span className="text-xs font-bold text-foreground">One-Click Apply</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                By submitting, your Aventra verified candidate dossier (headlines, skills list, bio, and resume credentials) will be instantly sent to the corporate pipeline dashboard.
              </p>

              {hasApplied ? (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 text-center space-y-1 mt-2">
                  <div className="flex items-center justify-center gap-1.5 text-emerald-700">
                    <ShieldCheck className="h-4.5 w-4.5" />
                    <span className="text-xs font-bold">Application Registered</span>
                  </div>
                  <p className="text-[10px] text-emerald-600">Track status in Applications panel.</p>
                </div>
              ) : (
                <Button
                  onClick={handleApplyAction}
                  disabled={isApplying}
                  className="w-full bg-aventra-500 hover:bg-aventra-600 text-white h-10 font-bold text-xs shadow-sm mt-2"
                >
                  {isApplying ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Submit Application Requisition
                </Button>
              )}

              <Separator className="my-4" />
              <div>
                <p className="text-[10px] text-muted-foreground leading-relaxed text-center">
                  Hiring managed by **{job.company?.name || "Corporate Lead"}** onboarding desk.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
  );
}
