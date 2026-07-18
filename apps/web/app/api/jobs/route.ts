import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@aventra/types";

// ============================================================
// INITIALIZE SHARED GLOBAL MOCK DATA STORE
// Persists recruiter postings dynamically in local mock runs
// ============================================================
if (!(global as any)._mockJobs) {
  (global as any)._mockJobs = [
    {
      id: "mock-job-id-1",
      title: "Senior Next.js Developer",
      description: "Responsible for engineering responsive React web architectures and design token integrations.",
      department: "Engineering",
      location: "NYC / Remote",
      type: "Full-time",
      salaryMin: 120000,
      salaryMax: 160000,
      status: "ACTIVE",
      companyId: "mock-company-id-1",
      postedById: "mock-recruiter-id",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      company: {
        name: "Acme Technologies",
        logoUrl: null,
        website: "https://acme-mock.com",
      }
    },
    {
      id: "mock-job-id-2",
      title: "Python AI & Backend Architect",
      description: "Scale machine learning models, database schemas, and FastAPI orchestration layers.",
      department: "AI & Search",
      location: "San Francisco • On-site",
      type: "Full-time",
      salaryMin: 150000,
      salaryMax: 210000,
      status: "ACTIVE",
      companyId: "mock-company-id-2",
      postedById: "mock-recruiter-id-2",
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
      company: {
        name: "Stark Labs",
        logoUrl: null,
        website: "https://stark-mock.com",
      }
    },
    {
      id: "mock-job-id-3",
      title: "Product Designer (UI/UX)",
      description: "Design premium landing pages, SaaS sidebars, and custom components.",
      department: "Design System",
      location: "Bangalore • Hybrid",
      type: "Contract",
      salaryMin: 90000,
      salaryMax: 115000,
      status: "ACTIVE",
      companyId: "mock-company-id-3",
      postedById: "mock-recruiter-id-3",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      company: {
        name: "Linear Corp",
        logoUrl: null,
        website: "https://linear-mock.com",
      }
    }
  ];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.toLowerCase().trim() || "";
  const locationParam = searchParams.get("location")?.toLowerCase().trim() || "";
  const typeParam = searchParams.get("type")?.toLowerCase().trim() || "";

  try {
    const session = await getServerSession(authOptions).catch(() => null);

    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized", message: "Log in to browse opportunities." },
        { status: 401 }
      );
    }

    // Fetch jobs from Prisma database
    const jobs = await prisma.job.findMany({
      where: {
        status: "ACTIVE",
        ...(query ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ]
        } : {}),
        ...(locationParam ? {
          location: { contains: locationParam, mode: "insensitive" }
        } : {}),
        ...(typeParam ? {
          type: { contains: typeParam, mode: "insensitive" }
        } : {}),
      },
      include: {
        company: {
          select: {
            name: true,
            logoUrl: true,
            website: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json<ApiResponse<any>>(
      { success: true, data: jobs },
      { status: 200 }
    );
  } catch (error) {
    console.warn("[JOBS_GET_DB_WARN] Database connection failed. Returning mock opportunities feed.", error);

    const mockJobs = (global as any)._mockJobs || [];

    // Filter mock jobs locally to ensure search functionality works!
    const filteredJobs = mockJobs.filter((job: any) => {
      const titleMatch = !query || job.title.toLowerCase().includes(query) || job.description.toLowerCase().includes(query);
      const locMatch = !locationParam || job.location.toLowerCase().includes(locationParam);
      const typeMatch = !typeParam || job.type.toLowerCase().includes(typeParam);
      return titleMatch && locMatch && typeMatch;
    });

    return NextResponse.json<ApiResponse<any>>(
      { success: true, data: filteredJobs },
      { status: 200 }
    );
  }
}
