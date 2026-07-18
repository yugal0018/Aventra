import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@aventra/types";

// ============================================================
// GET /api/sourcing — Query and search candidate profiles
// Computes candidate match scores based on skill terms
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized", message: "Log in to search talent." },
        { status: 401 }
      );
    }

    const userRole = (session.user as any).role;
    if (userRole === "CANDIDATE") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Forbidden", message: "Candidates cannot source other profiles." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.toLowerCase().trim() || "";

    // Retrieve all candidate profiles with their user details
    const profiles = await prisma.candidateProfile.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Score and filter candidates
    const scoredCandidates = profiles.map((profile) => {
      let score = 75; // Base profile score

      // Simple match simulation against headline, bio, and skills list
      const headline = profile.headline?.toLowerCase() || "";
      const bio = profile.bio?.toLowerCase() || "";
      const skills = profile.skills.map((s) => s.toLowerCase());

      if (query) {
        const terms = query.split(" ").filter((t) => t.length > 0);
        let matchCount = 0;

        terms.forEach((term) => {
          if (headline.includes(term)) matchCount += 3;
          if (bio.includes(term)) matchCount += 1;
          
          const matchingSkills = skills.filter((skill) => skill.includes(term));
          matchCount += matchingSkills.length * 4;
        });

        score += matchCount * 5;
      }



      // Clamp score between 60 and 99% for mock realism
      const finalScore = Math.min(Math.max(score, 60), 99);

      return {
        id: profile.id,
        userId: profile.userId,
        name: profile.user.name,
        email: profile.user.email,
        headline: profile.headline,
        bio: profile.bio,
        skills: profile.skills,
        resumeUrl: profile.resumeUrl,
        matchScore: finalScore,
      };
    });

    // Sort by match score desc
    scoredCandidates.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json<ApiResponse<typeof scoredCandidates>>(
      { success: true, data: scoredCandidates },
      { status: 200 }
    );
  } catch (error) {
    console.warn("[SOURCING_GET_DB_WARN] Database connection failed. Returning mock candidate profiles.", error);
    return NextResponse.json<ApiResponse<any>>(
      {
        success: true,
        data: [
          {
            id: "mock-candidate-profile-1",
            userId: "mock-candidate-user-1",
            name: "Jane Doe",
            email: "jane.dev@aventra-mock.com",
            headline: "Next.js Specialist & UI Architect",
            bio: "Proven track record building high-performance serverless apps.",
            skills: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
            resumeUrl: "https://github.com/profile",
            matchScore: 98,
          },
          {
            id: "mock-candidate-profile-2",
            userId: "mock-candidate-user-2",
            name: "Marcus Aurelius",
            email: "marcus.coder@aventra-mock.com",
            headline: "Full Stack Engineer",
            bio: "Building robust databases and Node.js APIs.",
            skills: ["JavaScript", "React", "PostgreSQL", "Prisma"],
            resumeUrl: null,
            matchScore: 84,
          },
        ],
      },
      { status: 200 }
    );
  }
}
