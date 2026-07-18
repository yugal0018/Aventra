import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateVerificationToken, sendVerificationEmail } from "@/lib/auth/email-verification";
import type { ApiResponse } from "@aventra/types";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Invalid email", message: "Email parameter is required." },
        { status: 400 }
      );
    }

    const lowerEmail = email.toLowerCase().trim();

    // 1. Check if user exists and is already verified
    const user = await prisma.user.findUnique({
      where: { email: lowerEmail },
    });

    if (!user) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "User not found", message: "No registered user found with this email." },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Already verified", message: "This email address has already been verified." },
        { status: 400 }
      );
    }

    // 2. Rate Limiting Check (60 seconds threshold)
    const existingToken = await prisma.verificationToken.findFirst({
      where: { email: lowerEmail },
    });

    if (existingToken) {
      const secondsSinceCreation = Math.floor(
        (Date.now() - new Date(existingToken.createdAt).getTime()) / 1000
      );
      
      if (secondsSinceCreation < 60) {
        const secondsRemaining = 60 - secondsSinceCreation;
        return NextResponse.json<ApiResponse>(
          { 
            success: false, 
            error: "Rate limited", 
            message: `Please wait ${secondsRemaining} seconds before requesting another verification email.` 
          },
          { status: 429 }
        );
      }
    }

    // 3. Generate token and dispatch verification email
    const vt = await generateVerificationToken(lowerEmail);
    await sendVerificationEmail(lowerEmail, vt.token);

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Verification email successfully resent! Please check your inbox.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to resend verification email:", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Internal server error", message: "Failed to dispatch verification email. Try again later." },
      { status: 500 }
    );
  }
}
