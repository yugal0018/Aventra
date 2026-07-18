import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@aventra/types";

// ============================================================
// GET /api/pipeline — Fetch company jobs and applicant records
// Auto-seeds mock jobs and applicants if database is empty
// ============================================================

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized", message: "Log in to retrieve pipelines." },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const userRole = (session.user as any).role;

    if (userRole === "CANDIDATE") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Forbidden", message: "Candidates cannot access corporate pipelines." },
        { status: 403 }
      );
    }

    // 1. Check if user is associated with a company.
    // If not, let's find or create a default mock company for development.
    let companyId = (session.user as any).companyId;
    if (!companyId) {
      // Find or create mock company
      let defaultCompany = await prisma.company.findFirst({
        where: { name: "Aventra Partners" },
      });
      if (!defaultCompany) {
        defaultCompany = await prisma.company.create({
          data: {
            name: "Aventra Partners",
            website: "https://aventra.io",
            description: "Default hiring partner corporate team.",
          },
        });
      }
      companyId = defaultCompany.id;

      // Update user association in DB
      await prisma.user.update({
        where: { id: userId },
        data: { companyId },
      });
    }

    // 2. Fetch jobs and their applications
    let jobs = await prisma.job.findMany({
      where: { companyId },
      include: {
        applications: {
          include: {
            candidate: {
              select: {
                id: true,
                name: true,
                email: true,
                candidateProfile: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // 3. Auto-seed mock jobs if none exist (guarantees a working visual board on first login!)
    if (jobs.length === 0) {
      // Create mock job 1
      const job1 = await prisma.job.create({
        data: {
          title: "Senior Next.js Developer",
          description: "Responsible for engineering responsive React web architectures and design token integrations.",
          department: "Engineering",
          location: "NYC / Remote",
          type: "Full-Time",
          salaryMin: 120000,
          salaryMax: 160000,
          status: "ACTIVE",
          companyId,
          postedById: userId,
        },
      });

      // Create mock candidate users to apply
      const mockCandidate1 = await prisma.user.create({
        data: {
          email: "jane.dev@aventra-mock.com",
          passwordHash: "mock-password-hash",
          name: "Jane Doe",
          role: "CANDIDATE",
          emailVerified: true,
          candidateProfile: {
            create: {
              headline: "Next.js Specialist & UI Architect",
              bio: "Proven track record building high-performance serverless apps.",
              skills: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
            },
          },
        },
      });

      const mockCandidate2 = await prisma.user.create({
        data: {
          email: "marcus.coder@aventra-mock.com",
          passwordHash: "mock-password-hash",
          name: "Marcus Aurelius",
          role: "CANDIDATE",
          emailVerified: true,
          candidateProfile: {
            create: {
              headline: "Full Stack Engineer",
              bio: "Building robust databases and Node.js APIs.",
              skills: ["JavaScript", "React", "PostgreSQL", "Prisma"],
            },
          },
        },
      });

      // Create applications
      await prisma.jobApplication.create({
        data: {
          jobId: job1.id,
          candidateId: mockCandidate1.id,
          status: "SCREENING",
          notes: "Excellent code style. Verified Github credentials match.",
        },
      });

      await prisma.jobApplication.create({
        data: {
          jobId: job1.id,
          candidateId: mockCandidate2.id,
          status: "APPLIED",
          notes: "Applied via waitlist pass link.",
        },
      });

      // Re-fetch jobs now that seeding is done
      jobs = await prisma.job.findMany({
        where: { companyId },
        include: {
          applications: {
            include: {
              candidate: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  candidateProfile: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json<ApiResponse<typeof jobs>>(
      { success: true, data: jobs },
      { status: 200 }
    );
  } catch (error) {
    console.warn("[PIPELINE_GET_DB_WARN] Database connection failed. Returning mock pipeline data.", error);
    
    const { getMockJobs, getMockApplications } = require("@/lib/mock-db");
    const mockJobsList = getMockJobs();
    const mockAppsList = getMockApplications();

    const mappedJobs = mockJobsList.map((job: any) => ({
      ...job,
      applications: mockAppsList.filter((app: any) => app.jobId === job.id),
    }));

    return NextResponse.json<ApiResponse<any>>(
      { success: true, data: mappedJobs },
      { status: 200 }
    );
  }
}
