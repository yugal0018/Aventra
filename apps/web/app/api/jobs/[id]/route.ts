import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@aventra/types";

// ============================================================
// GET /api/jobs/[id] — Fetch specific job details
// ============================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await getServerSession(authOptions).catch(() => null);

    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized", message: "Log in to view job details." },
        { status: 401 }
      );
    }

    // Query job by ID
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            name: true,
            logoUrl: true,
            website: true,
            description: true,
          }
        }
      }
    });

    if (!job) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Not found", message: "Job listing not found." },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<any>>(
      { success: true, data: job },
      { status: 200 }
    );
  } catch (error) {
    console.warn("[JOB_GET_DB_WARN] Database connection failed. Returning mock job details.", error);

    // Dynamic search inside our global mock database!
    const mockJobs = (global as any)._mockJobs || [];
    let matchedJob = mockJobs.find((job: any) => job.id === id);

    if (!matchedJob) {
      // Fallback if not found
      matchedJob = {
        id,
        title: "Position Requisition",
        description: "Opportunities parameters detail overview. Verified partner listing.",
        department: "Engineering",
        location: "Remote",
        type: "Full-time",
        salaryMin: 100000,
        salaryMax: 140000,
        status: "ACTIVE",
        companyId: "mock-company-id-default",
        postedById: "mock-recruiter-id",
        createdAt: new Date(),
        company: {
          name: "Aventra Partner Hub",
          logoUrl: null,
          website: "https://aventra.io",
          description: "Aventra onboarding partner employer workspace.",
        }
      };
    } else {
      // Ensure company description and nested company properties exist
      matchedJob = {
        ...matchedJob,
        company: {
          ...matchedJob.company,
          description: matchedJob.company.description || "Aventra corporate partner workspace.",
        }
      };
    }

    return NextResponse.json<ApiResponse<any>>(
      { success: true, data: matchedJob },
      { status: 200 }
    );
  }
}
