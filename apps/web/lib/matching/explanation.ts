import type { MatchBreakdown } from "./types";

// Generates natural-language summaries based on category scores and technology overlap
export function generateMatchExplanation(
  name: string,
  title: string,
  score: number,
  verdict: string,
  matchedSkills: string[],
  missingSkills: string[],
  candidateExp: number,
  requiredExp: number
): string {
  const verdictLower = verdict.toLowerCase();
  
  let opening = "";
  if (score >= 85) {
    opening = `${name} is an exceptional fit for the ${title} role.`;
  } else if (score >= 70) {
    opening = `${name} represents a strong potential match for the ${title} opening.`;
  } else if (score >= 50) {
    opening = `${name} is a fair candidate with partial alignment for the ${title} opening.`;
  } else {
    opening = `${name} shows low compatibility with the current requirements for the ${title} role.`;
  }

  const skillsText = matchedSkills.length > 0
    ? ` They demonstrate matching competencies in key technologies like ${matchedSkills.slice(0, 4).join(", ")}.`
    : " They currently lack explicit overlap with the primary required technical skills.";

  const expText = candidateExp >= requiredExp
    ? ` Their ${candidateExp} years of hands-on experience fully satisfies the target requirement of ${requiredExp} years.`
    : ` They possess ${candidateExp} years of experience, falling slightly short of the target ${requiredExp}-year requirement.`;

  const missingText = missingSkills.length > 0
    ? ` Familiarity with ${missingSkills.slice(0, 2).join(" and ")} would further strengthen their alignment.`
    : "";

  return `${opening}${skillsText}${expText}${missingText}`.trim();
}

// Generate actionable recommendations and strengths lists
export function generateStrengthsAndRecommendations(
  breakdown: MatchBreakdown,
  matchedSkills: string[],
  missingSkills: string[],
  candidateExp: number,
  requiredExp: number,
  isVerified: boolean
): { strengths: string[]; recommendations: string[] } {
  const strengths: string[] = [];
  const recommendations: string[] = [];

  // Strengths
  if (breakdown.skills >= 45) {
    strengths.push("Excellent technical stack alignment");
  }
  if (candidateExp >= requiredExp) {
    strengths.push(`Satisfies target experience level (${candidateExp} yrs vs ${requiredExp} yrs req.)`);
  }
  if (isVerified) {
    strengths.push("Verified GitHub Developer Credentials (trust-certified)");
  }
  if (breakdown.location === 5) {
    strengths.push("Optimal workspace/location compatibility");
  } else if (breakdown.location === 3) {
    strengths.push("Good hybrid/remote flexible alignment");
  }

  if (strengths.length === 0) {
    strengths.push("Baseline general engineering competencies matched");
  }

  // Recommendations
  if (!isVerified) {
    recommendations.push("Connect GitHub profile to unlock verification trust boost");
  }
  
  if (missingSkills.length > 0) {
    missingSkills.slice(0, 3).forEach(skill => {
      recommendations.push(`Highlight projects or build experience using ${skill}`);
    });
  }

  if (candidateExp < requiredExp) {
    recommendations.push("Highlight independent engineering work to bridge experience years gap");
  }

  if (recommendations.length === 0) {
    recommendations.push("Profile matches all core job criteria; schedule recruiter screening");
  }

  return { strengths, recommendations };
}
