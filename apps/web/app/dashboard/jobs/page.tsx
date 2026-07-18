"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Briefcase, DollarSign, Calendar, ChevronRight, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SkeletonCard } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function CandidateJobsFeedPage() {
  const { toast } = useToast();

  const [jobs, setJobs] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  // Fetch opportunities feed matches
  const loadJobsFeed = async (silent = false) => {
    if (!silent) setIsFetching(true);
    try {
      const res = await fetch("/api/jobs/matches");
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setJobs(result.data);
        }
      }
    } catch (err) {
      console.error("Failed to load jobs matches feed:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    void loadJobsFeed();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  // Reset filters
  const handleResetFilters = () => {
    setQuery("");
    setLocation("");
    setType("");
    // Reload feed instantly
    setIsFetching(true);
    fetch("/api/jobs/matches")
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) setJobs(result.data);
      })
      .finally(() => setIsFetching(false));
  };

  // Client-side filtering on matches results
  const filteredJobs = jobs.filter((item) => {
    const job = item.job || {};
    const matchesQuery = !query || 
      job.title.toLowerCase().includes(query.toLowerCase()) || 
      job.description.toLowerCase().includes(query.toLowerCase()) ||
      (job.company?.name || "").toLowerCase().includes(query.toLowerCase());
      
    const matchesLocation = !location ||
      job.location.toLowerCase().includes(location.toLowerCase());
      
    const matchesType = !type || type === "ALL" ||
      job.type.toLowerCase().includes(type.toLowerCase());
      
    return matchesQuery && matchesLocation && matchesType;
  });

  return (
    <div className="space-y-6 pt-2 select-none">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Explore Opportunities</h1>
          <p className="text-xs text-muted-foreground mt-0.5">Discover active job listings and apply with one click.</p>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => void loadJobsFeed()}
          className="h-9 w-9 bg-white text-muted-foreground hover:text-foreground"
          title="Reload listings"
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Filter panel */}
      <Card className="bg-white border-border shadow-sm">
        <CardContent className="p-4 md:p-6">
          <form onSubmit={handleSearchSubmit} className="grid gap-3 md:grid-cols-12 items-end">
            <div className="md:col-span-5 space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Search Keywords</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  placeholder="Role, skills, or description..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-9 h-9 bg-slate-50/50 border-border/80"
                />
              </div>
            </div>

            <div className="md:col-span-3 space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Location / Workspace</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <Input
                  placeholder="City, country or remote..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-9 h-9 bg-slate-50/50 border-border/80"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Commitment</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="h-9 bg-slate-50/50 border-border/80">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Remote">Remote Only</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 flex gap-2">
              <Button type="button" onClick={() => void loadJobsFeed()} disabled={isFetching} className="flex-1 bg-aventra-500 hover:bg-aventra-600 text-white h-9 text-xs font-bold">
                {isFetching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Search"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResetFilters}
                className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                title="Reset filters"
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Feed card grid */}
      <div className="space-y-4 max-w-4xl">
        {isFetching ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((item) => {
            const { job, match } = item;
            const timeAgo = Math.round(
              (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
            );
            const displayTime = timeAgo === 0 ? "Posted today" : `Posted ${timeAgo} days ago`;

            return (
              <Card key={job.id} className="bg-white border border-border/90 hover:border-aventra-200 hover:shadow-md transition-all relative overflow-hidden group">
                <CardContent className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Left: Metadata */}
                  <div className="space-y-2.5 flex-1 min-w-0">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-aventra-600 uppercase tracking-wider font-mono">
                          {job.department || "Engineering"}
                        </span>
                        {match && (
                          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[9px] font-bold shadow-sm">
                            <Sparkles className="h-2.5 w-2.5 shrink-0" />
                            {match.score}% Match
                          </div>
                        )}
                      </div>
                      <h3 className="text-sm font-bold text-foreground truncate group-hover:text-aventra-600 transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-[11px] text-muted-foreground font-semibold leading-none">
                        {job.company?.name || "Corporate Partner"}
                      </p>
                    </div>

                    {/* Meta parameter row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                        <span>{job.type}</span>
                      </div>
                      {(job.salaryMin || job.salaryMax) && (
                        <div className="flex items-center gap-0.5">
                          <DollarSign className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                          <span>
                            {job.salaryMin ? `$${(job.salaryMin / 1000).toFixed(0)}k` : "Open"}
                            {job.salaryMax ? ` - $${(job.salaryMax / 1000).toFixed(0)}k` : ""}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                        <span>{displayTime}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Button */}
                  <div className="shrink-0 flex items-center md:justify-end">
                    <Button asChild className="bg-slate-50 border border-slate-200 text-slate-700 hover:bg-aventra-50 hover:text-aventra-700 hover:border-aventra-100 h-9 px-4 gap-1 text-xs font-bold w-full md:w-auto shadow-sm">
                      <Link href={`/dashboard/jobs/${job.id}`}>
                        View Details
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
            <Briefcase className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-foreground">No opportunities listed</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              We couldn't find any job requisitions matching your current filters. Try resetting search parameters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
