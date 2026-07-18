"use client";

import React, { useState, useEffect } from "react";
import { Search, Link2, Sparkles, Compass, AlertTriangle, ExternalLink, PlusCircle, CheckCircle, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { UnifiedJob } from "@/lib/discover/services";

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState<"search" | "url" | "recs">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [jobs, setJobs] = useState<UnifiedJob[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);

  // URL Import State
  const [importUrl, setImportUrl] = useState("");
  const [importing, setImporting] = useState(false);
  const [importedJob, setImportedJob] = useState<UnifiedJob | null>(null);

  // AI Recs State
  const [recs, setRecs] = useState<{ job: UnifiedJob; matchScore: number; reason: string }[]>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);

  // Selected Preview state
  const [previewJob, setPreviewJob] = useState<UnifiedJob | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>({});
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const { toast } = useToast();

  // Load recommendations
  const fetchRecommendations = async () => {
    setLoadingRecs(true);
    try {
      const res = await fetch("/api/discover/recommend");
      const data = await res.json();
      if (data.success) {
        setRecs(data.recommendations);
      } else {
        toast({
          title: "Failed to load matches",
          description: data.error || "Could not retrieve AI matches.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Connection error",
        description: "Failed to reach AI recommendation service.",
        variant: "destructive",
      });
    } finally {
      setLoadingRecs(false);
    }
  };

  useEffect(() => {
    if (activeTab === "recs") {
      fetchRecommendations();
    }
  }, [activeTab]);

  // Initial trending jobs load
  useEffect(() => {
    handleSearch(true);
  }, []);

  const handleSearch = async (initial = false) => {
    if (initial) setLoading(true);
    else setSearching(true);

    try {
      const res = await fetch(`/api/discover/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      } else {
        toast({
          title: "Search failed",
          description: data.error || "Could not retrieve public jobs.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Connection error",
        description: "Failed to reach public job search service.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  const handleUrlImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importUrl.trim()) return;

    setImporting(true);
    setImportedJob(null);

    try {
      const res = await fetch("/api/discover/extract-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: importUrl.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setImportedJob(data.job);
        setPreviewJob(data.job);
        toast({
          title: "AI Analysis Complete",
          description: "Job details successfully extracted!",
        });
      } else {
        toast({
          title: "Import failed",
          description: data.error || "Check your URL and try again.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Connection error",
        description: "Failed to connect to AI parsing engine.",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleSaveToDashboard = async (job: UnifiedJob) => {
    setActionLoading(job.id);
    try {
      const res = await fetch("/api/discover/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedJobs(prev => ({ ...prev, [job.id]: true }));
        toast({
          title: "Added successfully!",
          description: "Check your Applications page to track this job.",
        });
      } else {
        toast({
          title: "Save failed",
          description: data.error || "Could not import job to dashboard.",
          variant: "destructive",
        });
      }
    } catch {
      toast({
        title: "Connection error",
        description: "Failed to submit job to local applications table.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* Premium Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-aventra-100 bg-gradient-to-r from-aventra-500/10 via-aventra-50 to-white p-6 md:p-8">
        <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-aventra-500/10 blur-3xl" />
        <div className="relative z-10 space-y-2.5">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-aventra-50 px-3 py-1 text-xs font-bold text-aventra-700">
            <Sparkles className="h-3.5 w-3.5" />
            AI Sourced & Matched
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
            Discover Global Job Opportunities
          </h1>
          <p className="text-sm text-slate-500 max-w-xl">
            Search real-time listings across free global directories, paste any job link for automated AI analysis, and view customized matches.
          </p>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab("search")}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "search"
              ? "border-aventra-500 text-aventra-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Compass className="h-4 w-4" />
          Global Search
        </button>
        <button
          onClick={() => setActiveTab("url")}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "url"
              ? "border-aventra-500 text-aventra-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Link2 className="h-4 w-4" />
          Import Job via URL
        </button>
        <button
          onClick={() => setActiveTab("recs")}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === "recs"
              ? "border-aventra-500 text-aventra-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <Sparkles className="h-4 w-4" />
          AI Fit Picks
        </button>
      </div>

      {/* Workspace Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Inputs and Job Cards list */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* TAB 1: Global Search */}
          {activeTab === "search" && (
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by keywords, skills, or job titles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-aventra-500/20 focus:border-aventra-500"
                  />
                </div>
                <button
                  onClick={() => handleSearch()}
                  disabled={searching}
                  className="px-6 py-3 bg-aventra-600 hover:bg-aventra-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {searching && <RefreshCw className="h-4 w-4 animate-spin" />}
                  Search
                </button>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-32 rounded-xl border border-slate-200 bg-white p-5 animate-pulse space-y-4">
                      <div className="h-4 bg-slate-200 rounded w-1/3" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                      <div className="h-3 bg-slate-200 rounded w-1/4" />
                    </div>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
                  No matching jobs found. Try adjusting your search query!
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      onClick={() => setPreviewJob(job)}
                      className={`group cursor-pointer rounded-xl border p-5 bg-white transition-all hover:shadow-md ${
                        previewJob?.id === job.id ? "border-aventra-500 ring-2 ring-aventra-500/15" : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {job.logoUrl && !imageErrors[job.id] ? (
                          <img 
                            src={job.logoUrl} 
                            alt={job.company} 
                            onError={() => setImageErrors(prev => ({ ...prev, [job.id]: true }))}
                            className="h-10 w-10 rounded-lg object-contain bg-slate-50 border border-slate-100 shrink-0" 
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-lg bg-aventra-50 border border-aventra-100 flex items-center justify-center font-bold text-aventra-700 text-sm shrink-0">
                            {job.company.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex-1 min-w-0 space-y-1">
                          <h3 className="font-bold text-slate-900 group-hover:text-aventra-700 transition-colors truncate">
                            {job.title}
                          </h3>
                          <p className="text-xs font-semibold text-slate-600 truncate">{job.company}</p>
                          <div className="flex flex-wrap gap-1.5 pt-1.5">
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                              {job.location}
                            </span>
                            {job.tags.slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="inline-flex items-center rounded-full bg-aventra-50/50 px-2 py-0.5 text-[10px] font-bold text-aventra-700">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: URL Importer */}
          {activeTab === "url" && (
            <div className="space-y-6">
              <form onSubmit={handleUrlImport} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Job Posting Web Address</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Link2 className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="url"
                        required
                        placeholder="Paste Lever, Greenhouse, Indeed, or LinkedIn link..."
                        value={importUrl}
                        onChange={(e) => setImportUrl(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-aventra-500/20 focus:border-aventra-500"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={importing}
                      className="px-6 py-3 bg-aventra-600 hover:bg-aventra-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                      {importing && <RefreshCw className="h-4 w-4 animate-spin" />}
                      {importing ? "AI is reading..." : "Analyze Link"}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 flex gap-3 text-xs text-slate-500">
                  <AlertTriangle className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    Our secure proxy validates URL IP destinations to safeguard internal data. Meta tag scraping is 100% free and client keys are never exposed.
                  </span>
                </div>
              </form>

              {importing && (
                <div className="h-48 rounded-xl border border-dashed border-aventra-200 bg-aventra-50/20 p-8 flex flex-col items-center justify-center text-center gap-3">
                  <RefreshCw className="h-8 w-8 text-aventra-600 animate-spin" />
                  <p className="text-sm font-semibold text-slate-700">Scraping site metadata and parsing job posting...</p>
                </div>
              )}

              {importedJob && (
                <div className="rounded-xl border border-aventra-500 ring-2 ring-aventra-500/15 bg-white p-5 space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-lg bg-aventra-100 border border-aventra-200 flex items-center justify-center font-bold text-aventra-700 text-sm">
                      {importedJob.company.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                        Ready to import
                      </div>
                      <h3 className="font-bold text-slate-900 text-base">{importedJob.title}</h3>
                      <p className="text-xs font-semibold text-slate-600">{importedJob.company}</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                          {importedJob.location}
                        </span>
                        {importedJob.tags.map((tag, i) => (
                          <span key={i} className="inline-flex items-center rounded-full bg-aventra-50/50 px-2 py-0.5 text-[10px] font-bold text-aventra-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI Recommendations */}
          {activeTab === "recs" && (
            <div className="space-y-6">
              {loadingRecs ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="h-36 rounded-xl border border-slate-200 bg-white p-5 animate-pulse space-y-4">
                      <div className="h-4 bg-slate-200 rounded w-1/4" />
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                      <div className="h-3 bg-slate-200 rounded w-1/3" />
                    </div>
                  ))}
                </div>
              ) : recs.length === 0 ? (
                <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-slate-400">
                  Complete your profile skills to generate personalized AI job suggestions!
                </div>
              ) : (
                <div className="space-y-4">
                  {recs.map((rec) => (
                    <div
                      key={rec.job.id}
                      onClick={() => setPreviewJob(rec.job)}
                      className={`group cursor-pointer rounded-xl border p-5 bg-white transition-all hover:shadow-md relative overflow-hidden ${
                        previewJob?.id === rec.job.id ? "border-aventra-500 ring-2 ring-aventra-500/15" : "border-slate-200"
                      }`}
                    >
                      <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 rounded-full bg-aventra-500/5 p-8" />
                      <div className="flex items-start gap-4">
                        <div className="h-10 w-10 rounded-lg bg-aventra-50 border border-aventra-100 flex items-center justify-center font-bold text-aventra-700 text-sm shrink-0">
                          {rec.job.company.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center rounded-full bg-aventra-600 px-2 py-0.5 text-[10px] font-bold text-white">
                              ✦ {rec.matchScore}% Match
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">AI Pick</span>
                          </div>
                          <h3 className="font-bold text-slate-900 group-hover:text-aventra-700 transition-colors truncate">
                            {rec.job.title}
                          </h3>
                          <p className="text-xs font-semibold text-slate-600 truncate">{rec.job.company}</p>
                          <p className="text-[11px] text-aventra-700 font-medium italic pt-1 line-clamp-1">
                            &ldquo;{rec.reason}&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Right Side: Job Description Details Preview panel */}
        <div className="lg:col-span-5">
          {previewJob ? (
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col max-h-[80vh]">
              {/* Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="font-bold text-slate-900 text-lg leading-tight">{previewJob.title}</h2>
                    <p className="text-xs font-semibold text-slate-600">{previewJob.company}</p>
                  </div>
                  {previewJob.logoUrl && !imageErrors[previewJob.id] ? (
                    <img 
                      src={previewJob.logoUrl} 
                      alt={previewJob.company} 
                      onError={() => setImageErrors(prev => ({ ...prev, [previewJob.id]: true }))}
                      className="h-10 w-10 rounded-lg object-contain bg-white border border-slate-100 shrink-0" 
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-aventra-50 border border-aventra-100 flex items-center justify-center font-bold text-aventra-700 text-sm shrink-0">
                      {previewJob.company.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-700">
                    📍 {previewJob.location}
                  </span>
                  {previewJob.salary && (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                      💰 {previewJob.salary}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <a
                    href={previewJob.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    Apply on Site
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  {savedJobs[previewJob.id] ? (
                    <button
                      disabled
                      className="px-4 py-2.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-emerald-200"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Imported
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSaveToDashboard(previewJob)}
                      disabled={actionLoading === previewJob.id}
                      className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {actionLoading === previewJob.id ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <PlusCircle className="h-3.5 w-3.5" />
                      )}
                      Track Job
                    </button>
                  )}
                </div>
              </div>

              {/* Body Description Content */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4 text-sm text-slate-600 leading-relaxed min-h-0">
                <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase">Job Description</h4>
                <div className="whitespace-pre-wrap">{previewJob.description}</div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-400 h-64 flex flex-col items-center justify-center gap-2">
              <Compass className="h-8 w-8 text-slate-300" />
              <p className="text-sm font-semibold">Select an opportunity to preview full details and start tracking.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
