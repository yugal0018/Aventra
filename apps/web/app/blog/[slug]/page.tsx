import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/section";

const ARTICLE_CONTENT: Record<
  string,
  {
    title: string;
    description: string;
    date: string;
    readTime: string;
    category: string;
    author: { name: string; role: string };
    htmlContent: string;
  }
> = {
  "re-architecting-modern-hiring": {
    title: "Re-architecting Modern Hiring: The Aventra Philosophy",
    description: "Why we are building a unified hiring ecosystem and how legacy databases are causing industry-wide friction.",
    date: "July 17, 2026",
    readTime: "5 min read",
    category: "Philosophy",
    author: { name: "Antigravity", role: "Technical Co-Founder" },
    htmlContent: `
      <p>
        Hiring is fundamentally a database synchronization problem. Today, when a company seeks a candidate, a recruiter is dispatched to mine LinkedIn, scraping details into a static CSV spreadsheet. The placement agency formats these details into custom templates, emailing them to the company's applicant tracking system (ATS).
      </p>
      <p>
        The result is a multi-sided synchronization lag: candidate data becomes obsolete the moment it is written, communication feedback takes weeks, and companies make hiring decisions on incomplete credential data.
      </p>
      <h3 style="font-size:18px;font-weight:700;color:#0a0a0a;margin-top:24px;margin-bottom:12px;">The Unified Solution</h3>
      <p>
        Aventra was conceived to solve this fragmentation by designing a single, unified database of truth. We bring candidates, agency recruiters, internal HR managers, and corporate departments together in one platform.
      </p>
      <p>
        Our workspaces sync parameters directly: when a candidate updates their verified qualifications, the update instantly propagates across all active hiring manager search panels, placement agency sheets, and scheduled interview calendars. No more manual updates, zero data latency, and absolute workflow clarity.
      </p>
    `
  },
  "importance-of-verified-credentials": {
    title: "The Death of the Resume: The Case for Verified Credentials",
    description: "How cryptographic verification of degree parameters and work history eliminates qualification inflation.",
    date: "July 10, 2026",
    readTime: "4 min read",
    category: "Security",
    author: { name: "Aventra Team", role: "Compliance Desk" },
    htmlContent: `
      <p>
        The traditional resume is a self-declared, unverified text document. Over 60% of technical resumes contain inflated qualifications, modified employment durations, or false project contributions. Sourcing teams spend billions verifying degrees and background history.
      </p>
      <p>
        At Aventra, we are designing a profile verification model that cryptographically anchors candidate credentials to their institutional sources.
      </p>
      <h3 style="font-size:18px;font-weight:700;color:#0a0a0a;margin-top:24px;margin-bottom:12px;">Cryptographic Anchoring</h3>
      <p>
        Through verified API syncs (like GitHub repo commits, verified university integrations, and workplace emails), Aventra anchors candidate qualifications dynamically.
      </p>
      <p>
        When a recruiter evaluates an Aventra candidate profile, they see a certified list of competencies. This eliminates qualification audits, reduces sourcing timelines by 75%, and builds an ecosystem of absolute trust.
      </p>
    `
  },
  "coordinating-placements-in-one-shared-database": {
    title: "Ecosystem Workspaces: Placement Agencies and Corporate Teams",
    description: "Bridging the communication lag between corporate hiring managers and placement agencies through shared dashboards.",
    date: "June 28, 2026",
    readTime: "6 min read",
    category: "Productivity",
    author: { name: "Product Design", role: "Architect Team" },
    htmlContent: `
      <p>
        External placement agencies handle a large percentage of executive placements, yet they operate completely decoupled from corporate candidate tracking systems. When an agency places a candidate, they rely on email chains to coordinate interviews and receive feedback.
      </p>
      <p>
        Aventra bridges this gap by introducing white-labeled multi-organization workspaces.
      </p>
      <h3 style="font-size:18px;font-weight:700;color:#0a0a0a;margin-top:24px;margin-bottom:12px;">Inter-Organization Portals</h3>
      <p>
        Agencies can suggest pre-vetted candidate dossiers directly into client employer portals. The hiring manager reviews credentials, updates candidate milestones, and shares ratings instantly in a shared workspace.
      </p>
      <p>
        This ends feedback latency, logs placement fee milestones automatically, and allows corporate hiring teams and recruitment agencies to collaborate seamlessly in one dashboard.
      </p>
    `
  }
};

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = ARTICLE_CONTENT[slug];

  if (!post) {
    notFound();
  }

  return (
    <div className="relative overflow-hidden bg-background py-16 lg:py-24">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 bg-indigo-500/5 blur-[80px]" />

      <div className="container mx-auto max-w-2xl px-4 relative z-10">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all articles
        </Link>

        {/* Eyebrow */}
        <div className="flex items-center justify-between text-xs font-semibold mb-4">
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-indigo-700">{post.category}</span>
          <div className="flex items-center gap-3 text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-display-md font-bold tracking-tight text-foreground sm:text-4xl mb-6">
          {post.title}
        </h1>

        {/* Author Panel */}
        <div className="flex items-center gap-3 border-y border-border py-4 my-6">
          <div className="h-8 w-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold font-mono text-xs">
            {post.author.name[0]}
          </div>
          <div>
            <p className="text-xs font-bold text-foreground">{post.author.name}</p>
            <p className="text-[10px] text-muted-foreground">{post.author.role}</p>
          </div>
        </div>

        {/* Content */}
        <div
          className="prose prose-slate max-w-none text-sm text-muted-foreground leading-relaxed space-y-6 pt-4"
          dangerouslySetInnerHTML={{ __html: post.htmlContent }}
        />

        <div className="mt-12 border-t border-border pt-6 flex justify-between items-center text-xs text-muted-foreground">
          <span>Aventra Insights Series</span>
          <Link href="/signup" className="text-indigo-600 font-semibold hover:underline">
            Join the Waitlist →
          </Link>
        </div>
      </div>
    </div>
  );
}
