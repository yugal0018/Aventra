import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { matchCandidateToJob } from "@/lib/matching/engine";
import type { ApiResponse } from "@aventra/types";

// ============================================================
// GET /api/jobs/matches — Match candidate against all active jobs
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized", message: "Log in to check job matching compatibility." },
        { status: 401 }
      );
    }

    const email = session.user.email?.toLowerCase().trim() || "";

    try {
      // 1. Fetch Candidate Profile from DB
      const user = await prisma.user.findUnique({
        where: { email },
        include: { candidateProfile: true },
      });

      if (!user || user.role !== "CANDIDATE") {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Forbidden", message: "Only candidate profiles can compute matched opportunities." },
          { status: 403 }
        );
      }

      // 2. Fetch all active jobs
      const jobs = await prisma.job.findMany({
        where: { status: "ACTIVE" },
        include: { company: true },
      });

      // 3. Compute matching result for each job
      const matches = jobs.map(job => {
        const matchResult = matchCandidateToJob(user, job);
        return {
          job: {
            id: job.id,
            title: job.title,
            description: job.description,
            department: job.department,
            location: job.location,
            type: job.type,
            salaryMin: job.salaryMin,
            salaryMax: job.salaryMax,
            createdAt: job.createdAt,
            company: job.company,
          },
          match: matchResult,
        };
      });

      // Sort by match score descending
      matches.sort((a, b) => b.match.score - a.match.score);

      return NextResponse.json<ApiResponse<typeof matches>>(
        { success: true, data: matches },
        { status: 200 }
      );

    } catch (dbError) {
      console.warn("[JOBS_MATCHES_GET_DB_WARN] Database connection failed. Proceeding in Mock Mode.", dbError);

      const { getMockCandidates, getMockJobs } = require("@/lib/mock-db");
      
      // Find candidate by email, or fallback to first mock candidate
      const mockCandidates = getMockCandidates();
      let candidate = mockCandidates.find((c: any) => c.email.toLowerCase() === email);
      if (!candidate) {
        // Fallback or dynamically create from session user details
        candidate = mockCandidates[0] || {
          id: `mock-candidate-id-${email}`,
          name: session.user.name || "Beta Member",
          email: email,
          role: "CANDIDATE",
          candidateProfile: {
            headline: "Software Engineer",
            bio: "Proven developer matching opportunities.",
            skills: ["React", "TypeScript", "Node.js"],
            yearsExperience: 3,
            preferredLocations: ["Remote"],
            verified: false,
          }
        };
      }

      const mockJobs = getMockJobs();
      const matches = mockJobs.map((job: any) => {
        const matchResult = matchCandidateToJob(candidate, job);
        return {
          job,
          match: matchResult,
        };
      });

      matches.sort((a: any, b: any) => b.match.score - a.match.score);

      return NextResponse.json<ApiResponse<any>>(
        { success: true, data: matches },
        { status: 200 }
      );
    }

  } catch (error: any) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Server Error", message: error.message || "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
