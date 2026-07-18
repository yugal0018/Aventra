"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal, StaggerGroup } from "@/components/ui/reveal";

const MOCK_POSTS = [
  {
    slug: "re-architecting-modern-hiring",
    title: "Re-architecting Modern Hiring: The Aventra Philosophy",
    description: "Why we are building a unified hiring ecosystem and how legacy databases are causing industry-wide friction.",
    date: "July 17, 2026",
    readTime: "5 min read",
    category: "Philosophy",
    author: {
      name: "Antigravity",
      role: "Technical Co-Founder"
    }
  },
  {
    slug: "importance-of-verified-credentials",
    title: "The Death of the Resume: The Case for Verified Credentials",
    description: "How cryptographic verification of degree parameters and work history eliminates qualification inflation.",
    date: "July 10, 2026",
    readTime: "4 min read",
    category: "Security",
    author: {
      name: "Aventra Team",
      role: "Compliance Desk"
    }
  },
  {
    slug: "coordinating-placements-in-one-shared-database",
    title: "Ecosystem Workspaces: Placement Agencies and Corporate Teams",
    description: "Bridging the communication lag between corporate hiring managers and placement agencies through shared dashboards.",
    date: "June 28, 2026",
    readTime: "6 min read",
    category: "Productivity",
    author: {
      name: "Product Design",
      role: "Architect Team"
    }
  }
];

export default function BlogPage() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 bg-indigo-500/5 blur-[100px]" />

      {/* Hero Header */}
      <Section size="lg" className="pt-24 lg:pt-32 text-center max-w-3xl mx-auto">
        <Reveal direction="up" delay={0.05}>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 mb-6">
            <Sparkles className="h-3.5 w-3.5" /> Blog
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <h1 className="text-display-lg font-bold tracking-tight text-foreground sm:text-display-xl">
            Aventra Insights
          </h1>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance">
            Thoughts, blueprints, and updates from the team building the future of talent discovery.
          </p>
        </Reveal>
      </Section>

      {/* Blog Posts Grid */}
      <Section size="lg" className="bg-slate-50/50 border-t border-border">
        <StaggerGroup className="grid gap-8 md:grid-cols-3">
          {MOCK_POSTS.map((post) => (
            <Card key={post.slug} className="bg-white border-border/80 hover:shadow-md hover:border-zinc-300 transition-all flex flex-col justify-between">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-700">{post.category}</span>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground hover:text-indigo-600 transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                </div>
              </CardContent>
              <div className="p-6 pt-0 border-t border-border/60 flex items-center justify-between mt-auto bg-slate-50/20">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-[9px] text-indigo-700 font-mono">
                    {post.author.name[0]}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-foreground">{post.author.name}</p>
                    <p className="text-[8px] text-muted-foreground">{post.author.role}</p>
                  </div>
                </div>
                <Link href={`/blog/${post.slug}`} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  Read <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Card>
          ))}
        </StaggerGroup>
      </Section>
    </div>
  );
}
