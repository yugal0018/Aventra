import { extractKeywordsFromText, getUniqueSkills } from "./keywords";

// Extends scoring with detailed computations for each category
export function calculateCategoryScores(
  candidate: any,
  job: any
): {
  breakdown: {
    skills: number;
    experience: number;
    role: number;
    location: number;
    verification: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
  requiredExperienceYears: number;
  candidateExperienceYears: number;
} {
  // --------------------------------------------------
  // 1. Skills Category (Max 60)
  // --------------------------------------------------
  const candidateSkills = getUniqueSkills(candidate.candidateProfile?.skills || []);
  
  // Extract target job skills
  let requiredSkills = getUniqueSkills(
    extractKeywordsFromText(job.title + " " + job.description)
  );
  
  // Fallback required skills if description yielded nothing
  if (requiredSkills.length === 0) {
    requiredSkills = ["React", "TypeScript", "Node.js"];
  }

  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  requiredSkills.forEach(reqSkill => {
    if (candidateSkills.some(candSkill => candSkill.toLowerCase() === reqSkill.toLowerCase())) {
      matchedSkills.push(reqSkill);
    } else {
      missingSkills.push(reqSkill);
    }
  });

  const skillsScore = Math.round(
    (matchedSkills.length / Math.max(requiredSkills.length, 1)) * 60
  );

  // --------------------------------------------------
  // 2. Experience Category (Max 15)
  // --------------------------------------------------
  let requiredExperienceYears = 3; // Default Mid-level
  const descLower = job.description.toLowerCase();
  const titleLower = job.title.toLowerCase();

  if (titleLower.includes("senior") || titleLower.includes("lead") || titleLower.includes("principal")) {
    requiredExperienceYears = 5;
  } else if (titleLower.includes("junior") || titleLower.includes("entry") || titleLower.includes("associate")) {
    requiredExperienceYears = 1;
  } else {
    // Attempt regex extraction (e.g. "5+ years", "3 years")
    const match = descLower.match(/(\d+)\+?\s*years?/);
    if (match && match[1]) {
      requiredExperienceYears = parseInt(match[1], 10);
    }
  }

  // Get candidate experience (default 3 years if not provided)
  const candidateProfile = candidate.candidateProfile || {};
  let candidateExperienceYears = typeof candidateProfile.yearsExperience === "number"
    ? candidateProfile.yearsExperience
    : (candidateProfile.experience && Array.isArray(candidateProfile.experience) 
        ? candidateProfile.experience.length * 2 
        : 3);

  // Score computation
  let experienceScore = 0;
  if (candidateExperienceYears >= requiredExperienceYears) {
    experienceScore = 15;
  } else {
    experienceScore = Math.round((candidateExperienceYears / Math.max(requiredExperienceYears, 1)) * 15);
  }

  // --------------------------------------------------
  // 3. Role Alignment Category (Max 10)
  // --------------------------------------------------
  const candidateHeadline = (candidateProfile.headline || "").toLowerCase();
  const jobTitleTerms = job.title.toLowerCase().split(/[\s/•·\-,]/).filter((term: string) => term.length > 2);
  
  let roleMatchTermsCount = 0;
  jobTitleTerms.forEach((term: string) => {
    if (candidateHeadline.includes(term)) {
      roleMatchTermsCount++;
    }
  });

  let roleScore = 0;
  if (roleMatchTermsCount >= 2) {
    roleScore = 10;
  } else if (roleMatchTermsCount === 1) {
    roleScore = 6;
  } else {
    roleScore = 2; // Baseline for general software roles
  }

  // --------------------------------------------------
  // 4. Location Category (Max 5)
  // --------------------------------------------------
  const jobLocation = job.location.toLowerCase();
  const preferredLocations: string[] = Array.isArray(candidateProfile.preferredLocations)
    ? candidateProfile.preferredLocations.map((l: string) => l.toLowerCase())
    : ["remote"];

  let locationScore = 0;
  const isJobRemote = jobLocation.includes("remote");
  const isJobHybrid = jobLocation.includes("hybrid");
  
  const prefersRemote = preferredLocations.includes("remote");
  const prefersHybrid = preferredLocations.includes("hybrid");

  if (isJobRemote && prefersRemote) {
    locationScore = 5;
  } else if (preferredLocations.some(loc => jobLocation.includes(loc))) {
    locationScore = 5; // Exact city/location match
  } else if ((isJobHybrid && prefersRemote) || (isJobRemote && prefersHybrid)) {
    locationScore = 3; // Partial compatibility
  } else {
    locationScore = 1; // Relocation or mismatched workspace type
  }

  // --------------------------------------------------
  // 5. Verification Category (Max 10)
  // --------------------------------------------------
  const isVerified = !!candidate.emailVerified;
  const verificationScore = isVerified ? 10 : 0;

  return {
    breakdown: {
      skills: skillsScore,
      experience: experienceScore,
      role: roleScore,
      location: locationScore,
      verification: verificationScore
    },
    matchedSkills,
    missingSkills,
    requiredExperienceYears,
    candidateExperienceYears
  };
}
