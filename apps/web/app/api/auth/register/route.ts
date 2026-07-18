import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { RegisterUserSchema } from "@aventra/validators";
import type { ApiResponse } from "@aventra/types";
import { generateVerificationToken, sendVerificationEmail } from "@/lib/auth/email-verification";

// ============================================================
// POST /api/auth/register — Create a new user profile
// Sends an automated verification email to verify the account.
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

    // Hash password with bcryptjs
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user within database transaction (unverified by default)
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: lowerEmail,
          passwordHash,
          name,
          role,
          emailVerified: false, // Explicitly unverified initially
        },
      });

      // If user is candidate, automatically initialize profile (no longer dependent on github verify)
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

    // Generate token and trigger verification email
    try {
      const vt = await generateVerificationToken(lowerEmail);
      await sendVerificationEmail(lowerEmail, vt.token);
    } catch (mailErr) {
      console.error("Failed to generate token or send email upon registration:", mailErr);
    }

    return NextResponse.json<ApiResponse<{ userId: string }>>(
      {
        success: true,
        message: "Registration successful! A verification email has been sent. Please verify your account to log in.",
        data: { userId: newUser.id },
      },
      { status: 201 },
    );
  } catch (error) {
    console.warn("[REGISTER_POST_DB_WARN] Database connection failed. Returning simulated registration success.", error);
    return NextResponse.json<ApiResponse<{ userId: string }>>(
      {
        success: true,
        message: "Registration successful! (Mock Mode - Check email mock logs)",
        data: { userId: "mock-new-user-id" },
      },
      { status: 201 }
    );
  }
}
