import dns from "dns";
import { promisify } from "util";
import { URL } from "url";

const lookupPromise = promisify(dns.lookup);

/**
 * Checks if an IP address belongs to local or private subnet ranges (SSRF Prevention)
 */
export function isSafeIp(ip: string): boolean {
  if (ip === "::1" || ip === "localhost") return false;

  const ipv4Parts = ip.split(".");
  if (ipv4Parts.length === 4) {
    const p1 = parseInt(ipv4Parts[0]!, 10);
    const p2 = parseInt(ipv4Parts[1]!, 10);

    if (p1 === 127 || p1 === 10) return false;
    if (p1 === 172 && p2 >= 16 && p2 <= 31) return false;
    if (p1 === 192 && p2 === 168) return false;
    if (p1 === 169 && p2 === 254) return false;
    if (p1 === 0) return false;
  }

  // IPv6 check for link-local and unique local addresses
  const lowerIp = ip.toLowerCase();
  if (
    lowerIp.startsWith("fe80:") || 
    lowerIp.startsWith("fc00:") || 
    lowerIp.startsWith("fd00:")
  ) {
    return false;
  }

  return true;
}

/**
 * Validates that a URL is well-formed, uses HTTP(S), and does not point to internal resources (SSRF Prevention)
 */
export async function isValidPublicUrl(urlString: string): Promise<boolean> {
  try {
    const parsedUrl = new URL(urlString);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return false;
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    
    // Explicit blocks for simple hostname bypasses
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname === "[::1]"
    ) {
      return false;
    }

    // Resolve hostname to get the actual target IP (prevents DNS Rebinding / Hostname SSRF)
    const { address } = await lookupPromise(hostname);
    return isSafeIp(address);
  } catch {
    return false;
  }
}

/**
 * Strips HTML tags and decodes common entities to prevent XSS and keep descriptions clean
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  let text = html.replace(/<[^>]*>/g, " ");
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/\s+/g, " "); // collapse spacing
  return text.trim();
}
