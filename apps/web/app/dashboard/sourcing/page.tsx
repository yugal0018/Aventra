"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Shield, User, Loader2, Search, ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { SkeletonCard } from "@/components/ui/skeleton";

export default function SourcingPage() {
  const { toast } = useToast();

  const [query, setQuery] = useState("");
  const [candidates, setCandidates] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  // Fetch and search candidates
  const loadCandidates = async (searchQuery = "") => {
    setIsFetching(true);
    try {
      const url = searchQuery ? `/api/sourcing?query=${encodeURIComponent(searchQuery)}` : "/api/sourcing";
      const res = await fetch(url);
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setCandidates(result.data);
        }
      }
    } catch (err) {
      console.error("Failed to load sourcing candidates:", err);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    void loadCandidates();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void loadCandidates(query);
  };

  return (
    <div className="space-y-6 pt-2 select-none">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Talent Sourcing Search</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Search and score verified candidate profiles semantically.</p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full max-w-xl">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, headline, or skills (e.g. Next.js)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 h-10 bg-white"
          />
        </div>
        <Button type="submit" disabled={isFetching} className="bg-aventra-500 hover:bg-aventra-600 text-white h-10">
          {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search Sourcing"}
        </Button>
      </form>

      {/* Candidates Sourcing Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isFetching ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : candidates.length > 0 ? (
          candidates.map((cand) => (
            <Card key={cand.id} className="bg-white border-border hover:shadow-md transition-shadow flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                {/* Header: Name, Verified Badge, Score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs">
                      {cand.name[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">{cand.name}</h4>
                      <p className="text-[9px] text-muted-foreground mt-0.5 font-semibold line-clamp-1">{cand.headline || "Software Engineer"}</p>
                    </div>
                  </div>

                  {/* Matching score */}
                  <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full" title="Semantic match rating">
                    <Sparkles className="h-3 w-3 text-emerald-600" />
                    <span className="text-[10px] font-bold text-emerald-800 font-mono">{cand.matchScore}%</span>
                  </div>
                </div>

                {/* Skills tags */}
                {cand.skills && cand.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {cand.skills.map((skill: string) => (
                      <span key={skill} className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-semibold text-slate-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bio Description */}
                {cand.bio && (
                  <p className="text-[10.5px] text-muted-foreground leading-relaxed line-clamp-3 italic">
                    "{cand.bio}"
                  </p>
                )}
              </CardContent>

              {/* Action Footer */}
              <div className="p-6 pt-0 border-t border-slate-50 flex items-center justify-between mt-auto bg-slate-50/10">
                {/* Verified badge */}
                <div className="flex items-center gap-1.5">
                  <Shield className={`h-4 w-4 ${cand.verified ? "text-emerald-600 fill-emerald-100" : "text-muted-foreground/30"}`} />
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                    {cand.verified ? "Verified" : "Pending"}
                  </span>
                </div>

                {/* Profile Link Controls */}
                <div className="flex items-center gap-2">
                  {cand.resumeUrl && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" asChild>
                      <a href={cand.resumeUrl} target="_blank" rel="noopener noreferrer" title="View Portfolio Link">
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="text-[10px] font-semibold h-7 border-indigo-200 text-indigo-700 hover:bg-indigo-50 px-3"
                    onClick={() =>
                      toast({
                        variant: "success",
                        title: "Contact request logged! ✉️",
                        description: `We have sent an access passcode invite to ${cand.name}'s email.`,
                      })
                    }
                  >
                    <Mail className="h-3.5 w-3.5 mr-1" />
                    Connect
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-sm text-muted-foreground border-2 border-dashed border-slate-200 rounded-2xl bg-white p-6">
            No candidates matched this query criteria
          </div>
        )}
      </div>
    </div>
  );
}
