import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  // Access Guard: Candidate must be authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const userRole = (session.user as any).role;

  if (userRole !== "CANDIDATE") {
    return NextResponse.json({ error: "Forbidden: Only candidates can import jobs" }, { status: 403 });
  }

  try {
    const { job } = await request.json();
    if (!job || !job.title || !job.company) {
      return NextResponse.json({ success: false, error: "Invalid job details provided" }, { status: 400 });
    }

    // 1. Ensure default Importer Company exists
    let company = await prisma.company.findFirst({
      where: { name: "External Job Boards" }
    });
    if (!company) {
      company = await prisma.company.create({
        data: { 
          name: "External Job Boards", 
          website: "https://aventra.vercel.app",
          description: "System channel for imported external job listings"
        }
      });
    }

    // 2. Ensure default Importer Recruiter user exists
    let importerUser = await prisma.user.findUnique({
      where: { email: "importer@aventra.com" }
    });
    if (!importerUser) {
      importerUser = await prisma.user.create({
        data: {
          email: "importer@aventra.com",
          passwordHash: "$2a$10$tJ88sMoxv0k49fWwLixY6ug4M6gWw.7N5Z5GvE5jF1vD0fO7hUe1q", // mock hash
          name: "Aventra Importer",
          role: "RECRUITER",
          companyId: company.id
        }
      });
    }

    // 3. Create the Job locally under the Importer account
    const localJob = await prisma.job.create({
      data: {
        title: job.title,
        description: job.description,
        location: job.location,
        type: job.tags && job.tags.length > 0 ? job.tags.slice(0, 3).join(", ") : "Full-Time",
        companyId: company.id,
        postedById: importerUser.id,
        status: "ACTIVE"
      }
    });

    // 4. Create the JobApplication for the logged-in candidate
    const application = await prisma.jobApplication.create({
      data: {
        jobId: localJob.id,
        candidateId: userId,
        status: "APPLIED",
        notes: `Imported via URL: ${job.url || "Public Search"}`
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Job imported and added to application pipeline!",
      jobId: localJob.id,
      applicationId: application.id
    });
  } catch (error) {
    console.error("Job import DB save error:", error);
    return NextResponse.json({ success: false, error: "Failed to save imported job to database" }, { status: 500 });
  }
}
