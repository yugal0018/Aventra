import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

  if (!token) {
    return NextResponse.redirect(`${baseUrl}/login?error=InvalidToken`);
  }

  try {
    // 1. Locate token
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.redirect(`${baseUrl}/login?error=InvalidToken`);
    }

    // 2. Check if expired
    const hasExpired = new Date() > new Date(verificationToken.expiresAt);
    if (hasExpired) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: { token },
      });
      return NextResponse.redirect(`${baseUrl}/login?error=ExpiredToken&email=${encodeURIComponent(verificationToken.email)}`);
    }

    // 3. Mark user as verified in database
    await prisma.$transaction([
      prisma.user.update({
        where: { email: verificationToken.email },
        data: { emailVerified: true },
      }),
      // 4. Invalidate/Delete the token so it cannot be reused
      prisma.verificationToken.delete({
        where: { token },
      }),
    ]);

    return NextResponse.redirect(`${baseUrl}/login?verified=true`);
  } catch (error) {
    console.error("Token verification failed:", error);
    return NextResponse.redirect(`${baseUrl}/login?error=VerificationFailed`);
  }
}
