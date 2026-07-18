import { sanitizeHtml } from "./security";

export interface UnifiedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  url: string;
  logoUrl?: string;
  tags: string[];
  salary?: string;
  createdAt: string;
}

/**
 * Searches public remote jobs using the Remotive API
 */
export async function searchRemotiveJobs(query: string): Promise<UnifiedJob[]> {
  try {
    const url = `https://remotive.com/api/remote-jobs?search=${encodeURIComponent(query)}&limit=15`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.jobs || !Array.isArray(data.jobs)) return [];

    return data.jobs.map((job: any) => ({
      id: `remotive-${job.id}`,
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location || "Remote",
      description: sanitizeHtml(job.description),
      url: job.url,
      logoUrl: job.company_logo,
      tags: job.tags || [],
      salary: job.salary || undefined,
      createdAt: job.publication_date || new Date().toISOString(),
    }));
  } catch (err) {
    console.error("Remotive search failed:", err);
    return [];
  }
}

/**
 * Searches public jobs using the Arbeitnow API
 */
export async function searchArbeitnowJobs(query: string): Promise<UnifiedJob[]> {
  try {
    // Note: Arbeitnow does not support inline search queries on keyless REST endpoints easily,
    // so we search their standard feed and filter local results matching query
    const url = `https://www.arbeitnow.com/api/job-board-api`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return [];

    const data = await res.json();
    if (!data.data || !Array.isArray(data.data)) return [];

    const lowercaseQuery = query.toLowerCase();
    const matchedJobs = data.data.filter((job: any) => {
      return (
        job.title.toLowerCase().includes(lowercaseQuery) ||
        job.company_name.toLowerCase().includes(lowercaseQuery) ||
        (job.tags && job.tags.some((tag: string) => tag.toLowerCase().includes(lowercaseQuery)))
      );
    });

    return matchedJobs.slice(0, 15).map((job: any) => ({
      id: `arbeitnow-${job.slug}`,
      title: job.title,
      company: job.company_name,
      location: job.formatted_address || "Germany",
      description: sanitizeHtml(job.description),
      url: job.link,
      tags: job.tags || [],
      createdAt: job.created_at || new Date().toISOString(),
    }));
  } catch (err) {
    console.error("Arbeitnow search failed:", err);
    return [];
  }
}

/**
 * Combines and normalizes search queries from multiple free providers
 */
export async function searchAllPublicJobs(query: string): Promise<UnifiedJob[]> {
  // If no query, run trending searches
  const searchQuery = query.trim() || "developer";
  const [remotive, arbeitnow] = await Promise.all([
    searchRemotiveJobs(searchQuery),
    searchArbeitnowJobs(searchQuery),
  ]);

  return [...remotive, ...arbeitnow];
}

/**
 * Calls Gemini REST API to extract job post details securely
 */
export async function extractJobDetailsWithGemini(htmlContent: string): Promise<Partial<UnifiedJob> | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null; // Fallback to parsing directly
  }

  // Slice content to fit prompt limits
  const cleanText = htmlContent.substring(0, 15000);

  const prompt = `You are an expert AI job parser. Parse the following raw HTML or text from a job posting web page. Extract:
1. Job Title
2. Company Name
3. Location (or "Remote" if remote)
4. Description (detailed text, clean up any HTML tags)
5. Tech Skills required (as a string array)
6. Salary range (if mentioned, otherwise null)

Return ONLY a valid JSON object matching this schema, without any markdown formatting or surrounding code blocks:
{
  "title": "string or null",
  "company": "string or null",
  "location": "string or null",
  "description": "string or null",
  "tags": ["string"],
  "salary": "string or null"
}

Raw Text Content:
${cleanText}`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return null;

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) return null;

    const parsedJson = JSON.parse(resultText.trim());
    return {
      title: parsedJson.title || undefined,
      company: parsedJson.company || undefined,
      location: parsedJson.location || undefined,
      description: parsedJson.description ? sanitizeHtml(parsedJson.description) : undefined,
      tags: parsedJson.tags || [],
      salary: parsedJson.salary || undefined,
    };
  } catch (err) {
    console.error("Gemini job extraction failed:", err);
    return null;
  }
}

/**
 * Calls Gemini REST API to suggest personalized jobs
 */
export async function getGeminiRecommendations(
  candidateProfile: { skills: string[]; headline?: string; bio?: string },
  jobs: UnifiedJob[]
): Promise<{ jobId: string; matchScore: number; reason: string }[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return [];

  const candidateSummary = `
Headline: ${candidateProfile.headline || "N/A"}
Bio: ${candidateProfile.bio || "N/A"}
Skills: ${candidateProfile.skills.join(", ")}
`;

  const jobsList = jobs.map((job) => ({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description.substring(0, 300),
    tags: job.tags,
  }));

  const prompt = `You are a career advisor. Match this candidate profile against the list of jobs provided.
Select the top 3 best matching jobs. For each selected job, provide:
1. A match score (0 to 100)
2. A single concise sentence explaining why it fits them.

Candidate:
${candidateSummary}

Jobs:
${JSON.stringify(jobsList, null, 2)}

Return ONLY a valid JSON array of objects matching this schema, without any markdown formatting:
[
  {
    "jobId": "string",
    "matchScore": number,
    "reason": "string"
  }
]`;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.2,
        },
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) return [];

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) return [];

    return JSON.parse(resultText.trim());
  } catch (err) {
    console.error("Gemini recommendations failed:", err);
    return [];
  }
}
