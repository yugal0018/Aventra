import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { matchCandidateToJob } from "@/lib/matching/engine";
import type { ApiResponse } from "@aventra/types";

// ============================================================
// GET /api/pipeline/matches — Match all candidates to a specific job
// ============================================================
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized", message: "Log in to view matches." },
        { status: 401 }
      );
    }

    const userRole = (session.user as any).role;
    if (userRole === "CANDIDATE") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Forbidden", message: "Candidates cannot access recruiter matching panels." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get("jobId");

    if (!jobId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Bad Request", message: "Missing required query parameter: jobId" },
        { status: 400 }
      );
    }

    try {
      // 1. Fetch Job from DB
      const job = await prisma.job.findUnique({
        where: { id: jobId },
      });

      if (!job) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Not Found", message: "Job listing not found." },
          { status: 404 }
        );
      }

      // 2. Fetch all candidates with profiles
      const candidates = await prisma.user.findMany({
        where: { role: "CANDIDATE" },
        include: { candidateProfile: true },
      });

      // 3. Compute matches
      const matches = candidates.map(candidate => {
        const matchResult = matchCandidateToJob(candidate, job);
        return {
          candidate: {
            id: candidate.id,
            name: candidate.name,
            email: candidate.email,
            candidateProfile: candidate.candidateProfile,
          },
          match: matchResult,
        };
      });

      // Sort by score descending
      matches.sort((a, b) => b.match.score - a.match.score);

      return NextResponse.json<ApiResponse<typeof matches>>(
        { success: true, data: matches },
        { status: 200 }
      );

    } catch (dbError) {
      console.warn("[MATCHES_GET_DB_WARN] Database connection failed. Proceeding in Mock Mode.", dbError);

      const { getMockJobs, getMockCandidates } = require("@/lib/mock-db");
      const mockJobs = getMockJobs();
      const job = mockJobs.find((j: any) => j.id === jobId);

      if (!job) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Not Found", message: "Mock Job listing not found." },
          { status: 404 }
        );
      }

      const mockCandidates = getMockCandidates();
      const matches = mockCandidates.map((candidate: any) => {
        const matchResult = matchCandidateToJob(candidate, job);
        return {
          candidate,
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
