export interface MatchBreakdown {
  skills: number;       // Max 60
  experience: number;   // Max 15
  role: number;         // Max 10
  location: number;     // Max 5
  verification: number; // Max 10
}

export interface MatchingResult {
  score: number;        // Total sum of breakdown (max 100)
  verdict: "Exemplary Match" | "Strong Match" | "Fair Match" | "Low Match";
  matchedSkills: string[];
  missingSkills: string[];
  strengths: string[];
  recommendations: string[];
  explanation: string;
  breakdown: MatchBreakdown;
}
