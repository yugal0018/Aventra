"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ClipboardList, ExternalLink, Calendar, MapPin, RefreshCw, Briefcase, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SkeletonText } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

// Maps ApplicationStatus to semantic colors
const STATUS_STYLES: Record<string, { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "info" }> = {
  APPLIED: { label: "Applied", variant: "info" },
  SCREENING: { label: "In Review", variant: "secondary" },
  INTERVIEW: { label: "Interviewing", variant: "warning" },
  OFFER: { label: "Offered", variant: "success" },
  REJECTED: { label: "Not Selected", variant: "destructive" },
  PLACED: { label: "Hired 🎉", variant: "success" },
};

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch applications log
  const loadApplications = async (silent = false) => {
    if (!silent) setIsFetching(true);
    try {
      const res = await fetch("/api/applications");
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setApplications(result.data);
        }
      }
    } catch (err) {
      console.error("Failed to load candidate applications:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    void loadApplications();
  }, []);

  return (
    <div className="space-y-6 pt-2 select-none">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">My Applications</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Track the status of your submitted job requisitions.</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => void loadApplications()}
          className="h-9 w-9 bg-white text-muted-foreground hover:text-foreground"
          title="Reload log"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Submissions list */}
      <div className="max-w-4xl space-y-4">
        {isFetching ? (
          <Card className="bg-white border-border">
            <CardContent className="p-8">
              <SkeletonText lines={6} />
            </CardContent>
          </Card>
        ) : applications.length > 0 ? (
          applications.map((app) => {
            const statusConfig = STATUS_STYLES[app.status] || { label: app.status, variant: "default" };
            const appliedDate = new Date(app.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            });

            return (
              <Card key={app.id} className="bg-white border border-border/90 hover:shadow-sm transition-shadow">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Left: Job metadata */}
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-foreground truncate">{app.job?.title}</h4>
                      <p className="text-[10px] text-muted-foreground font-semibold">
                        {app.job?.company?.name || "Corporate Partner"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                        <span>{app.job?.location || "Remote"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                        <span>Applied {appliedDate}</span>
                      </div>
                    </div>

                    {/* Recruiter feedback notes */}
                    {app.notes && (
                      <div className="rounded-lg bg-slate-50 border border-slate-100 p-2.5 text-[9.5px] text-muted-foreground leading-relaxed italic mt-2.5 max-w-xl">
                        "Feedback note: {app.notes}"
                      </div>
                    )}
                  </div>

                  {/* Right: Status and Details link */}
                  <div className="shrink-0 flex items-center justify-between sm:justify-end gap-4 border-t border-slate-50 pt-3 sm:border-t-0 sm:pt-0">
                    <div className="flex items-center gap-1">
                      <Badge variant={statusConfig.variant}>
                        {statusConfig.label}
                      </Badge>
                    </div>

                    <Button asChild variant="ghost" size="sm" className="text-aventra-600 hover:text-aventra-700 hover:bg-aventra-50/50 text-[10px] font-bold gap-1 px-3">
                      <Link href={`/dashboard/jobs/${app.jobId}`}>
                        View Listing
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-16 bg-white border border-dashed border-slate-200 rounded-2xl p-6">
            <ClipboardList className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-foreground">No applications found</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              You haven't submitted any job applications yet. Visit the jobs feed to discover positions.
            </p>
            <Button asChild className="mt-4 bg-aventra-500 hover:bg-aventra-600 text-white h-9 text-xs">
              <Link href="/dashboard/jobs">Browse Active Jobs</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
