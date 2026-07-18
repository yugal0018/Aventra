import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { searchAllPublicJobs, getGeminiRecommendations, UnifiedJob } from "@/lib/discover/services";
import { matchCandidateToJob } from "@/lib/matching/engine";

export async function GET(request: Request) {
  // Access Guard: Candidate must be authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    // 1. Fetch Candidate Profile details from existing Database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        candidateProfile: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const candidateProfile = {
      name: user.name,
      skills: user.candidateProfile?.skills || [],
      headline: user.candidateProfile?.headline || "Software Engineer",
      bio: user.candidateProfile?.bio || "",
      candidateProfile: user.candidateProfile, // compatible with lib/matching/engine expectations
    };

    // 2. Determine search keyword based on candidate's skills or headline
    const searchKeyword = (candidateProfile.skills.length > 0 && candidateProfile.skills[0])
      ? candidateProfile.skills[0]
      : "developer";

    // 3. Fetch trending jobs from public keyless API
    const jobs = await searchAllPublicJobs(searchKeyword);
    if (jobs.length === 0) {
      return NextResponse.json({ success: true, recommendations: [] });
    }

    const recommendations: { job: UnifiedJob; matchScore: number; reason: string }[] = [];

    // 4. Use Gemini AI Engine if key is configured, otherwise fallback to local matching engine
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const aiRecs = await getGeminiRecommendations(candidateProfile, jobs);
      
      aiRecs.forEach((rec) => {
        const matchingJob = jobs.find((j) => j.id === rec.jobId);
        if (matchingJob) {
          recommendations.push({
            job: matchingJob,
            matchScore: rec.matchScore,
            reason: rec.reason,
          });
        }
      });
    }

    // 5. Fallback or addition: If AI recommendations returned nothing or key is absent, use local scoring
    if (recommendations.length === 0) {
      const scoredJobs = jobs.map((job) => {
        const matchResult = matchCandidateToJob(user, {
          title: job.title,
          description: job.description,
          location: job.location,
          type: job.tags.join(", "),
          salaryMin: null,
          salaryMax: null,
        });

        return {
          job,
          matchScore: matchResult.score,
          reason: matchResult.explanation || `Good match based on your skills in ${searchKeyword}.`,
        };
      });

      // Sort by score descending and take top 3
      scoredJobs.sort((a, b) => b.matchScore - a.matchScore);
      recommendations.push(...scoredJobs.slice(0, 3));
    }

    return NextResponse.json({ success: true, recommendations });
  } catch (error) {
    console.error("Discover recommendation error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
