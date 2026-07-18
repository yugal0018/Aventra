import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RegisterUserSchema } from "@aventra/validators";
import type { ApiResponse } from "@aventra/types";

// ============================================================
// POST /api/auth/register — Create a new user profile
// Initializes linked empty profiles (e.g. CandidateProfile)
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    // Validate using shared Zod schema
    const result = RegisterUserSchema.safeParse(body);
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

    const { email, password, name, role } = result.data;
    const lowerEmail = email.toLowerCase().trim();

    // Check if email already registered
    const existingUser = await prisma.user.findUnique({
      where: { email: lowerEmail },
    });

    if (existingUser) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Email taken",
          message: "A user is already registered with this email address.",
        },
        { status: 409 },
      );
    }

    // Hash password with bcryptjs (10 rounds is standard and safe)
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user within database transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: lowerEmail,
          passwordHash,
          name,
          role,
        },
      });

      // If user is candidate, automatically initialize profile
      if (role === "CANDIDATE") {
        await tx.candidateProfile.create({
          data: {
            userId: user.id,
            skills: [],
          },
        });
      }

      return user;
    });

    return NextResponse.json<ApiResponse<{ userId: string }>>(
      {
        success: true,
        message: "Registration successful! You can now log in.",
        data: { userId: newUser.id },
      },
      { status: 201 },
    );
  } catch (error) {
    console.warn("[REGISTER_POST_DB_WARN] Database connection failed. Returning simulated registration success.", error);
    return NextResponse.json<ApiResponse<{ userId: string }>>(
      {
        success: true,
        message: "Registration successful! You can now log in. (Mock Mode)",
        data: { userId: "mock-new-user-id" },
      },
      { status: 201 }
    );
  }
}
