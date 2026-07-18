import { NextResponse } from "next/server";
import { searchAllPublicJobs } from "@/lib/discover/services";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  // Access Guard: Candidate must be authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "";

  try {
    const jobs = await searchAllPublicJobs(query);
    return NextResponse.json({ success: true, jobs });
  } catch (error) {
    console.error("Discover search error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
