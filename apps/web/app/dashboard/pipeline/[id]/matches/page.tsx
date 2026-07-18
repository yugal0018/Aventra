"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Sparkles, Shield, User, MapPin, Briefcase, 
  RefreshCw, ChevronRight, CheckCircle2, AlertCircle, 
  MessageSquare, Loader2, Info, Check, Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function RecruiterMatchesPage() {
  const { toast } = useToast();
  const { id: jobId } = useParams() as { id: string };
  const router = useRouter();

  const [matches, setMatches] = useState<any[]>([]);
  const [job, setJob] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>(null);

  // Fetch job and matches list
  const loadMatches = async (silent = false) => {
    if (!silent) setIsFetching(true);
    try {
      // 1. Fetch matches
      const res = await fetch(`/api/pipeline/matches?jobId=${jobId}`);
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setMatches(result.data);
          
          // Auto-expand first candidate match
          if (result.data.length > 0) {
            setExpandedCandidateId(result.data[0].candidate.id);
          }
        }
      }

      // 2. Fetch job details
      const jobRes = await fetch(`/api/jobs/${jobId}`);
      if (jobRes.ok) {
        const jobResult = await jobRes.json();
        if (jobResult.success && jobResult.data) {
          setJob(jobResult.data);
        }
      }
    } catch (err) {
      console.error("Failed to load pipeline matches:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    void loadMatches();
  }, [jobId]);

  // Color helper for scores
  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 70) return "text-indigo-600 bg-indigo-50 border-indigo-200";
    if (score >= 50) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-slate-600 bg-slate-50 border-slate-200";
  };

  const getScoreProgressColor = (score: number) => {
    if (score >= 85) return "bg-emerald-500";
    if (score >= 70) return "bg-indigo-500";
    if (score >= 50) return "bg-amber-500";
    return "bg-slate-400";
  };

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-aventra-500" />
        <p className="text-xs text-muted-foreground">Running candidate matching heuristics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-2 select-none">
      {/* Return link */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/pipeline"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Pipelines
        </Link>
      </div>

      {/* Header controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <h1 className="text-2xl font-bold tracking-tight text-foreground">AI Candidate Matcher</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Heuristics-driven applicant scoring and alignment breakdowns.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => void loadMatches()}
          className="h-9 w-9 p-0 bg-white text-muted-foreground hover:text-foreground md:self-end"
          title="Recalculate matches"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-12 items-start max-w-6xl">
        {/* Left column: Job Summary Card */}
        {job && (
          <Card className="lg:col-span-4 bg-white border-border shadow-sm">
            <CardHeader className="p-5 border-b border-slate-100 bg-slate-50/50">
              <span className="text-[10px] font-bold text-aventra-600 uppercase tracking-wider font-mono">
                {job.department || "General"}
              </span>
              <CardTitle className="text-sm font-bold text-foreground mt-1">
                {job.title}
              </CardTitle>
              <CardDescription className="text-[10px] font-medium mt-0.5">
                {job.company?.name} • {job.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Workspace Type</p>
                <p className="font-bold text-foreground">{job.type}</p>
              </div>

              {(job.salaryMin || job.salaryMax) && (
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Target Compensation</p>
                  <p className="font-bold text-foreground">
                    {job.salaryMin ? `$${(job.salaryMin / 1000).toFixed(0)}k` : "Open"}
                    {job.salaryMax ? ` - $${(job.salaryMax / 1000).toFixed(0)}k` : ""}
                  </p>
                </div>
              )}

              <Separator />

              <div className="space-y-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Role Summary</p>
                <p className="text-muted-foreground leading-relaxed line-clamp-4">
                  {job.description}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Right column: Matches List */}
        <div className="lg:col-span-8 space-y-4">
          {matches.length > 0 ? (
            matches.map((item) => {
              const { candidate, match } = item;
              const isExpanded = expandedCandidateId === candidate.id;
              const profile = candidate.candidateProfile || {};

              return (
                <Card 
                  key={candidate.id} 
                  className={`bg-white border transition-all duration-200 overflow-hidden ${
                    isExpanded 
                      ? "border-aventra-300 ring-1 ring-aventra-50/50 shadow-md" 
                      : "border-border/80 hover:border-slate-300 shadow-sm"
                  }`}
                >
                  {/* Card Header (Collapsed view summary) */}
                  <div 
                    onClick={() => setExpandedCandidateId(isExpanded ? null : candidate.id)}
                    className="p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/40 select-none"
                  >
                    <div className="min-w-0 flex-1 flex items-start gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
                        {candidate.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-xs font-bold text-foreground">{candidate.name}</p>
                          {profile.verified && (
                            <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-emerald-50 text-emerald-600" title="Verified candidate">
                              <Shield className="h-2.5 w-2.5 fill-emerald-100" />
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground truncate font-medium mt-0.5">
                          {profile.headline || "Software Engineer"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className={`px-2.5 py-1 rounded-full border text-[10px] font-bold ${getScoreColor(match.score)}`}>
                        {match.score}% Match
                      </div>
                    </div>
                  </div>

                  {/* Expanded detail content */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/20 p-5 space-y-6">
                      {/* AI Verdict Sentence */}
                      <div className="rounded-xl border border-indigo-100/60 bg-indigo-50/20 p-4 flex items-start gap-3">
                        <Award className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider font-mono">
                            AI Match Verdict: {match.verdict.toUpperCase()}
                          </p>
                          <p className="text-xs text-slate-700 leading-relaxed mt-1">
                            {match.explanation}
                          </p>
                        </div>
                      </div>

                      {/* Category Breakdown visual progress bars */}
                      <div className="space-y-4">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Compatibility Breakdown</p>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                              <span>Technical Skills</span>
                              <span>{match.breakdown.skills} / 60</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${getScoreProgressColor(match.score)}`} style={{ width: `${(match.breakdown.skills / 60) * 100}%` }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                              <span>Experience alignment</span>
                              <span>{match.breakdown.experience} / 15</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${getScoreProgressColor(match.score)}`} style={{ width: `${(match.breakdown.experience / 15) * 100}%` }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                              <span>Role Alignment</span>
                              <span>{match.breakdown.role} / 10</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${getScoreProgressColor(match.score)}`} style={{ width: `${(match.breakdown.role / 10) * 100}%` }} />
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-semibold text-slate-600">
                              <span>Location Alignment</span>
                              <span>{match.breakdown.location} / 5</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${getScoreProgressColor(match.score)}`} style={{ width: `${(match.breakdown.location / 5) * 100}%` }} />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Skills Overlap display */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Matching Skills</p>
                          {match.matchedSkills.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {match.matchedSkills.map((skill: string) => (
                                <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold text-emerald-700 border border-emerald-200">
                                  <Check className="h-2.5 w-2.5" />
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] text-muted-foreground italic">No matching skills identified.</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">Missing Required Skills</p>
                          {match.missingSkills.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {match.missingSkills.map((skill: string) => (
                                <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-semibold text-amber-700 border border-amber-200">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[10px] text-muted-foreground italic">All required skills present.</p>
                          )}
                        </div>
                      </div>

                      {/* Strengths & Recommendations Bullet lists */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Strengths */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Strengths Key Takeaways</p>
                          <ul className="text-xs text-slate-600 space-y-1.5">
                            {match.strengths.map((str: string, index: number) => (
                              <li key={index} className="flex items-start gap-1.5 leading-relaxed">
                                <span className="text-emerald-500 font-bold shrink-0">✔</span>
                                <span>{str}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Recommendations */}
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Actionable Match Optimization</p>
                          <ul className="text-xs text-slate-600 space-y-1.5">
                            {match.recommendations.map((rec: string, index: number) => (
                              <li key={index} className="flex items-start gap-1.5 leading-relaxed">
                                <span className="text-amber-500 font-bold shrink-0">•</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <Separator />

                      {/* Actions */}
                      <div className="flex justify-end gap-2">
                        <Button 
                          asChild
                          variant="outline" 
                          className="h-8 text-[10px] font-bold bg-white text-slate-600 border-slate-200 hover:text-slate-700 hover:bg-slate-50 gap-1.5"
                        >
                          <Link href="/dashboard/messages">
                            <MessageSquare className="h-3.5 w-3.5" />
                            Message Candidate
                          </Link>
                        </Button>
                        <Button 
                          onClick={() => {
                            toast({
                              variant: "success",
                              title: "Pipeline Updated! ✦",
                              description: `${candidate.name} advanced to Interview stage.`,
                            });
                          }}
                          className="h-8 text-[10px] font-bold bg-aventra-500 hover:bg-aventra-600 text-white"
                        >
                          Schedule Interview Requisition
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })
          ) : (
            <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl p-6 select-none">
              <User className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-foreground">No candidate matches calculated</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Check back soon as candidate profiles register in the system.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
