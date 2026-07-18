"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Shield, User, Loader2, RefreshCw, ChevronRight, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SkeletonCard } from "@/components/ui/skeleton";
import { ApplicationStatus } from "@aventra/types";

// Columns in the pipeline board
const PIPELINE_COLUMNS: { status: ApplicationStatus; label: string; bg: string }[] = [
  { status: "APPLIED", label: "Applied", bg: "bg-slate-50 border-slate-200" },
  { status: "SCREENING", label: "Screening", bg: "bg-indigo-50/20 border-indigo-100" },
  { status: "INTERVIEW", label: "Interviewing", bg: "bg-amber-50/20 border-amber-100" },
  { status: "OFFER", label: "Offered", bg: "bg-emerald-50/20 border-emerald-100" },
];

export default function PipelinePage() {
  const { toast } = useToast();

  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [isFetching, setIsFetching] = useState(true);
  const [isUpdatingId, setIsUpdatingId] = useState<string | null>(null);
  const [hoveredColumn, setHoveredColumn] = useState<string | null>(null);

  // Fetch jobs and applications
  const fetchPipelines = async (silent = false) => {
    if (!silent) setIsFetching(true);
    try {
      const res = await fetch("/api/pipeline");
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setJobs(result.data);
          // Auto-select first job if none selected
          if (result.data.length > 0 && !selectedJobId) {
            setSelectedJobId(result.data[0].id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch pipelines:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    void fetchPipelines();
  }, []);

  // Update candidate application status
  const handleStatusChange = async (applicationId: string, nextStatus: ApplicationStatus) => {
    setIsUpdatingId(applicationId);
    try {
      const response = await fetch(`/api/pipeline/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          variant: "success",
          title: "Status Updated! ✦",
          description: "Pipeline column changed successfully.",
        });
        // Silent reload to refresh columns
        await fetchPipelines(true);
      } else {
        toast({
          variant: "destructive",
          title: "Update failed",
          description: data.message || "Failed to update candidate status.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Failed to connect to application server.",
      });
    } finally {
      setIsUpdatingId(null);
    }
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId);
  const applications = selectedJob?.applications || [];

  // Filter applications by column status
  const getAppsForColumn = (status: ApplicationStatus) => {
    return applications.filter((app: any) => app.status === status);
  };

  if (isFetching) {
    return (
      <div className="space-y-6 pt-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Hiring pipelines...</h1>
        </div>
        <div className="grid gap-6 md:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-2 select-none">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Candidate Pipelines</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Manage and move candidates through recruitment columns.</p>
        </div>

        {/* Job selector and reload */}
        <div className="flex items-center gap-2">
          {jobs.length > 0 && (
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger className="w-[220px] bg-white h-9">
                <SelectValue placeholder="Select Job Listing" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem key={job.id} value={job.id}>
                    {job.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => void fetchPipelines()}
            className="h-9 w-9 bg-white text-muted-foreground hover:text-foreground"
            title="Refresh pipeline data"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>

          {selectedJobId && (
            <Button asChild variant="outline" className="h-9 border-indigo-200 bg-indigo-50/50 hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 text-xs font-bold shadow-sm px-3.5 gap-1.5">
              <Link href={`/dashboard/pipeline/${selectedJobId}/matches`}>
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                AI Matches
              </Link>
            </Button>
          )}

          <Button asChild className="h-9 bg-aventra-500 hover:bg-aventra-600 text-white text-xs font-bold shadow-sm px-3.5">
            <Link href="/dashboard/pipeline/new">
              Post a Job
            </Link>
          </Button>
        </div>
      </div>

      {/* Summary Metrics */}
      {selectedJob && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white border-border/80 shadow-sm p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><Briefcase className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] text-muted-foreground leading-none">Job Department</p>
              <p className="text-xs font-bold text-foreground mt-1">{selectedJob.department || "General"}</p>
            </div>
          </Card>
          <Card className="bg-white border-border/80 shadow-sm p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><User className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] text-muted-foreground leading-none">Total Applicants</p>
              <p className="text-xs font-bold text-foreground mt-1">{applications.length} candidates</p>
            </div>
          </Card>
          <Card className="bg-white border-border/80 shadow-sm p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><Shield className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] text-muted-foreground leading-none">Verified Rate</p>
              <p className="text-xs font-bold text-foreground mt-1">
                {Math.round(
                  (applications.filter((app: any) => app.candidate?.candidateProfile?.verified).length /
                    (applications.length || 1)) *
                    100
                )}
                % verified
              </p>
            </div>
          </Card>
          <Card className="bg-white border-border/80 shadow-sm p-4 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600"><Sparkles className="h-4 w-4" /></div>
            <div>
              <p className="text-[10px] text-muted-foreground leading-none">Open Location</p>
              <p className="text-xs font-bold text-foreground mt-1">{selectedJob.location}</p>
            </div>
          </Card>
        </div>
      )}

      {/* Kanban Board Grid */}
      <div className="grid gap-4 md:grid-cols-4 items-start">
        {PIPELINE_COLUMNS.map((col) => {
          const colApps = getAppsForColumn(col.status);
          const isHovered = hoveredColumn === col.status;

          return (
            <div
              key={col.status}
              onDragOver={(e) => e.preventDefault()}
              onDragEnter={(e) => {
                e.preventDefault();
                setHoveredColumn(col.status);
              }}
              onDragLeave={() => setHoveredColumn(null)}
              onDrop={(e) => {
                const appId = e.dataTransfer.getData("text/plain");
                setHoveredColumn(null);
                if (appId) {
                  void handleStatusChange(appId, col.status);
                }
              }}
              className={`rounded-2xl border p-4 transition-all duration-200 min-h-[450px] space-y-4 ${
                isHovered
                  ? "bg-indigo-50 border-aventra-400 ring-2 ring-aventra-100 shadow-sm"
                  : col.bg
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between border-b border-border/60 pb-2">
                <span className="text-xs font-bold text-foreground uppercase tracking-wider">{col.label}</span>
                <span className="rounded-full bg-slate-200/80 px-2 py-0.5 text-[9px] font-bold text-slate-700 font-mono">
                  {colApps.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-3">
                {colApps.length > 0 ? (
                  colApps.map((app: any) => {
                    const profile = app.candidate?.candidateProfile;
                    const isCandidateVerified = !!profile?.verified;

                    return (
                      <Card
                        key={app.id}
                        draggable="true"
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", app.id);
                        }}
                        className="bg-white border-border hover:shadow-md transition-shadow relative cursor-grab active:cursor-grabbing hover:border-slate-300"
                      >
                        <CardContent className="p-4 space-y-3">
                          {/* Name + Badge */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-xs font-bold text-foreground">{app.candidate?.name}</p>
                              <p className="text-[9px] text-muted-foreground font-semibold mt-0.5 line-clamp-1">
                                {profile?.headline || "Software Engineer"}
                              </p>
                            </div>
                            {isCandidateVerified && (
                              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600" title="Aventra Verified Candidate">
                                <Shield className="h-3 w-3 fill-emerald-100" />
                              </div>
                            )}
                          </div>

                          {/* Skills tags */}
                          {profile?.skills && profile.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {profile.skills.slice(0, 3).map((tag: string) => (
                                <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Application Notes */}
                          {app.notes && (
                            <div className="border-t border-slate-100 pt-2 text-[9px] text-muted-foreground leading-relaxed italic line-clamp-2">
                              "{app.notes}"
                            </div>
                          )}

                          {/* Column Update Selector */}
                          <div className="border-t border-slate-100 pt-2 flex items-center justify-between">
                            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-wider">Move column</span>
                            {isUpdatingId === app.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin text-aventra-600" />
                            ) : (
                              <Select
                                value={app.status}
                                onValueChange={(val) => void handleStatusChange(app.id, val as ApplicationStatus)}
                              >
                                <SelectTrigger className="w-[100px] h-7 text-[10px] bg-slate-50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="APPLIED">Applied</SelectItem>
                                  <SelectItem value="SCREENING">Screening</SelectItem>
                                  <SelectItem value="INTERVIEW">Interview</SelectItem>
                                  <SelectItem value="OFFER">Offer</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-xs text-muted-foreground border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/10">
                    No candidates here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
