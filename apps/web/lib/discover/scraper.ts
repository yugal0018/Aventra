import { sanitizeHtml } from "./security";

interface ScrapedJobInfo {
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  tags: string[];
  salary?: string;
}

/**
 * Scrapes HTML of a URL and attempts to extract job structured metadata via JSON-LD or meta tags
 */
export async function scrapeJobUrl(url: string): Promise<ScrapedJobInfo> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) {
      throw new Error(`Scraper failed to load page: ${res.statusText}`);
    }

    const html = await res.text();
    return parseHtmlMetadata(html);
  } catch (err) {
    console.error("URL Scraping failed:", err);
    return { tags: [] };
  }
}

/**
 * Regex-based HTML Parser for metadata extraction (avoids heavy DOM dependencies)
 */
export function parseHtmlMetadata(html: string): ScrapedJobInfo {
  const result: ScrapedJobInfo = { tags: [] };

  // 1. Try to extract JSON-LD structured data (Schema.org)
  const jsonLdRegex = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = jsonLdRegex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]!.trim());
      
      // Handle array of schemas or single schema
      const schemas = Array.isArray(parsed) ? parsed : [parsed];
      const jobPosting = schemas.find((s: any) => 
        s["@type"] === "JobPosting" || 
        (s["@context"] && s["@context"].includes("schema.org") && s["@type"] === "JobPosting")
      );

      if (jobPosting) {
        result.title = jobPosting.title || undefined;
        result.company = jobPosting.hiringOrganization?.name || undefined;
        
        // Location parsing
        if (jobPosting.jobLocation) {
          const loc = jobPosting.jobLocation.address;
          result.location = typeof loc === "string" 
            ? loc 
            : `${loc?.addressLocality || ""}, ${loc?.addressCountry || ""}`.trim().replace(/^,\s*/, "");
        }
        
        result.description = jobPosting.description ? sanitizeHtml(jobPosting.description) : undefined;
        
        // Salary parsing
        if (jobPosting.baseSalary?.value) {
          const val = jobPosting.baseSalary.value;
          result.salary = typeof val === "number" 
            ? `$${val.toLocaleString()}` 
            : `${val.minValue || ""}-${val.maxValue || ""} ${val.currency || ""}`.trim();
        }
        
        if (jobPosting.skills) {
          result.tags = Array.isArray(jobPosting.skills) 
            ? jobPosting.skills 
            : typeof jobPosting.skills === "string" 
              ? jobPosting.skills.split(",").map((s: string) => s.trim())
              : [];
        }
        
        break; // found it
      }
    } catch {
      // skip malformed JSON blocks
    }
  }

  // 2. If JSON-LD didn't yield values, parse OpenGraph and Meta tags
  if (!result.title) {
    const ogTitle = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["'](.*?)["']/i) ||
                    html.match(/<meta[^>]*name=["']twitter:title["'][^>]*content=["'](.*?)["']/i);
    if (ogTitle?.[1]) {
      result.title = ogTitle[1];
    } else {
      const pageTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
      if (pageTitle?.[1]) {
        result.title = pageTitle[1].trim();
      }
    }
  }

  if (!result.company) {
    const ogCompany = html.match(/<meta[^>]*property=["']og:site_name["'][^>]*content=["'](.*?)["']/i);
    if (ogCompany?.[1]) {
      result.company = ogCompany[1];
    }
  }

  if (!result.description) {
    const ogDesc = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["'](.*?)["']/i) ||
                   html.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i);
    if (ogDesc?.[1]) {
      result.description = sanitizeHtml(ogDesc[1]);
    }
  }

  return result;
}
