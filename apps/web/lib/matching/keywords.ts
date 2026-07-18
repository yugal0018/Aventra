export const TECH_KEYWORDS = [
  "React",
  "Next.js",
  "NextJS",
  "TypeScript",
  "Javascript",
  "Node.js",
  "NodeJS",
  "Node",
  "PostgreSQL",
  "Postgres",
  "Prisma",
  "Tailwind CSS",
  "TailwindCSS",
  "Tailwind",
  "Docker",
  "Kubernetes",
  "AWS",
  "Amazon Web Services",
  "Google Cloud",
  "GCP",
  "Rust",
  "Go",
  "Golang",
  "Python",
  "Django",
  "FastAPI",
  "GraphQL",
  "Apollo",
  "Redux",
  "Zustand",
  "Framer Motion",
  "Radix UI",
  "Shadcn",
  "Prisma ORM",
  "CSS",
  "HTML",
  "SQL",
  "MongoDB",
  "Redis",
  "CI/CD",
  "GitHub Actions"
];

// Helper to normalize and check for keyword occurrences in a body of text
export function extractKeywordsFromText(text: string): string[] {
  if (!text) return [];
  const normalizedText = text.toLowerCase();
  
  return TECH_KEYWORDS.filter(keyword => {
    // Escape regex special chars
    const escaped = keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    // Word boundary check (allow variations like next.js / nextjs)
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    return regex.test(normalizedText);
  }).map(k => {
    // Map aliases to standard keywords
    if (k.toLowerCase() === "nextjs") return "Next.js";
    if (k.toLowerCase() === "nodejs" || k.toLowerCase() === "node") return "Node.js";
    if (k.toLowerCase() === "postgres") return "PostgreSQL";
    if (k.toLowerCase() === "tailwindcss" || k.toLowerCase() === "tailwind") return "Tailwind CSS";
    return k;
  });
}

// Remove duplicates and return unique normalized array
export function getUniqueSkills(skills: string[]): string[] {
  const normalizedMap = new Map<string, string>();
  skills.forEach(s => {
    let standard = s;
    if (s.toLowerCase() === "nextjs") standard = "Next.js";
    if (s.toLowerCase() === "nodejs" || s.toLowerCase() === "node") standard = "Node.js";
    if (s.toLowerCase() === "postgres") standard = "PostgreSQL";
    if (s.toLowerCase() === "tailwindcss" || s.toLowerCase() === "tailwind") standard = "Tailwind CSS";
    
    // Key by lower case, store standard formatting
    normalizedMap.set(standard.toLowerCase(), standard);
  });
  return Array.from(normalizedMap.values());
}
