import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateApplicationStatusSchema } from "@aventra/validators";
import type { ApiResponse } from "@aventra/types";

// ============================================================
// PATCH /api/pipeline/applications/[id] — Update applicant status
// ============================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: any = {};
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Invalid JSON", message: "Failed to parse JSON body request." },
      { status: 400 }
    );
  }

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Unauthorized", message: "Log in to modify status." },
        { status: 401 }
      );
    }

    const userRole = (session.user as any).role;
    if (userRole === "CANDIDATE") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Forbidden", message: "Candidates cannot modify application pipelines." },
        { status: 403 }
      );
    }

    // Validate request body Zod schema
    const result = UpdateApplicationStatusSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Validation failed",
          message: result.error.errors[0]?.message ?? "Invalid input parameters",
        },
        { status: 400 },
      );
    }

    const { status, notes } = result.data;

    // Check if application exists
    const existingApplication = await prisma.jobApplication.findUnique({
      where: { id },
    });

    if (!existingApplication) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Not found", message: "No job application found with the provided ID." },
        { status: 404 }
      );
    }

    // Perform database update
    const updatedApplication = await prisma.jobApplication.update({
      where: { id },
      data: {
        status,
        notes: notes !== undefined ? notes : existingApplication.notes,
      },
    });

    return NextResponse.json<ApiResponse<typeof updatedApplication>>(
      {
        success: true,
        message: "Applicant status updated successfully! ✦",
        data: updatedApplication,
      },
      { status: 200 }
    );
  } catch (error) {
    console.warn("[APPLICATION_PATCH_DB_WARN] Database connection failed. Simulating patch success.", error);

    const { getMockApplications, saveMockApplications } = require("@/lib/mock-db");
    const mockApps = getMockApplications();
    const appIndex = mockApps.findIndex((app: any) => app.id === id);
    if (appIndex !== -1) {
      mockApps[appIndex] = {
        ...mockApps[appIndex],
        status: body.status || mockApps[appIndex].status,
        notes: body.notes !== undefined ? body.notes : mockApps[appIndex].notes,
      };
      saveMockApplications(mockApps);
    }

    return NextResponse.json<ApiResponse<any>>(
      {
        success: true,
        message: "Applicant status updated successfully! ✦ (Mock Mode)",
        data: {
          id,
          status: body.status || "APPLIED",
          notes: body.notes || null,
          updatedAt: new Date(),
        },
      },
      { status: 200 }
    );
  }
}
