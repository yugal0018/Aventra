import { calculateCategoryScores } from "./scoring";
import { generateMatchExplanation, generateStrengthsAndRecommendations } from "./explanation";
import type { MatchingResult } from "./types";

/**
 * Decoupled Matching Engine
 * Computes structured compatibility metrics between a candidate profile and a job listing.
 * Easily swappable/extendable to call external AI models (like Gemini) in the future.
 */
export function matchCandidateToJob(candidate: any, job: any): MatchingResult {
  if (!candidate || !job) {
    throw new Error("Candidate and Job objects are required for matching.");
  }

  // Calculate breakdown category scores
  const {
    breakdown,
    matchedSkills,
    missingSkills,
    requiredExperienceYears,
    candidateExperienceYears
  } = calculateCategoryScores(candidate, job);

  // Calculate sum total score (max 100)
  const score = Math.max(
    0,
    Math.min(
      100,
      breakdown.skills +
      breakdown.experience +
      breakdown.role +
      breakdown.location +
      breakdown.verification
    )
  );

  // Map verdict
  let verdict: MatchingResult["verdict"] = "Low Match";
  if (score >= 85) {
    verdict = "Exemplary Match";
  } else if (score >= 70) {
    verdict = "Strong Match";
  } else if (score >= 50) {
    verdict = "Fair Match";
  }

  // Generate explanation
  const candidateName = candidate.name || "Candidate";
  const explanation = generateMatchExplanation(
    candidateName,
    job.title,
    score,
    verdict,
    matchedSkills,
    missingSkills,
    candidateExperienceYears,
    requiredExperienceYears
  );

  // Generate strengths & recommendations
  const isVerified = !!candidate.candidateProfile?.verified;
  const { strengths, recommendations } = generateStrengthsAndRecommendations(
    breakdown,
    matchedSkills,
    missingSkills,
    candidateExperienceYears,
    requiredExperienceYears,
    isVerified
  );

  return {
    score,
    verdict,
    matchedSkills,
    missingSkills,
    strengths,
    recommendations,
    explanation,
    breakdown
  };
}
