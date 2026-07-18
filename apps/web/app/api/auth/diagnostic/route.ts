import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  let dbConnection = false;
  let dbError: string | null = null;

  try {
    // Attempt a lightweight raw query to test database connectivity
    await prisma.$queryRaw`SELECT 1`;
    dbConnection = true;
  } catch (err: any) {
    dbError = err.message || String(err);
  }

  return NextResponse.json({
    success: true,
    diagnostics: {
      NEXTAUTH_SECRET_SET: !!process.env.NEXTAUTH_SECRET,
      AUTH_SECRET_SET: !!process.env.AUTH_SECRET,
      NEXTAUTH_URL_SET: !!process.env.NEXTAUTH_URL,
      NEXTAUTH_URL_VALUE: process.env.NEXTAUTH_URL || "NOT_SET",
      DATABASE_URL_SET: !!process.env.DATABASE_URL,
      DIRECT_DATABASE_URL_SET: !!process.env.DIRECT_DATABASE_URL,
      DB_CONNECTED: dbConnection,
      DB_ERROR_MESSAGE: dbError,
      NODE_ENV: process.env.NODE_ENV,
    }
  });
}
