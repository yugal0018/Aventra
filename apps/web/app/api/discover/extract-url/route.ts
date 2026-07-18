import { NextResponse } from "next/server";
import { isValidPublicUrl, sanitizeHtml } from "@/lib/discover/security";
import { scrapeJobUrl } from "@/lib/discover/scraper";
import { extractJobDetailsWithGemini } from "@/lib/discover/services";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  // Access Guard: Candidate must be authenticated
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { url } = await request.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ success: false, error: "Invalid URL parameter" }, { status: 400 });
    }

    // SSRF Guard: Validate URL target is safe
    const isSafe = await isValidPublicUrl(url);
    if (!isSafe) {
      return NextResponse.json({ 
        success: false, 
        error: "URL is invalid or pointing to a restricted local address." 
      }, { status: 400 });
    }

    // 1. Scrape raw HTML and attempt JSON-LD extraction
    const rawResult = await scrapeJobUrl(url);

    // 2. Fetch full HTML to pass to Gemini (if API Key is configured for smart extraction)
    let finalResult = { ...rawResult };
    
    if (process.env.GEMINI_API_KEY) {
      const pageRes = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (pageRes.ok) {
        const fullHtml = await pageRes.text();
        const aiResult = await extractJobDetailsWithGemini(fullHtml);
        if (aiResult) {
          finalResult = {
            ...finalResult,
            ...aiResult,
          };
        }
      }
    }

    // 3. Fallback/Ensure basic parameters
    const hostname = new URL(url).hostname;
    const cleanCompany = finalResult.company || hostname.replace("www.", "").split(".")[0] || "Unknown Company";

    const job = {
      title: finalResult.title || "Job Opportunity",
      company: cleanCompany,
      location: finalResult.location || "Remote / Hybrid",
      description: finalResult.description || "No description could be extracted.",
      tags: finalResult.tags || [],
      salary: finalResult.salary || undefined,
      url: url,
    };

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("URL Import error:", error);
    return NextResponse.json({ success: false, error: "Internal server error during URL parsing" }, { status: 500 });
  }
}
