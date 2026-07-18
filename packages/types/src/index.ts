// ============================================================
// AVENTRA — Shared TypeScript Types
// Consumed by apps/web and apps/api (Phase 2)
// ============================================================

// ============================================================
// ENUMS
// ============================================================

export type UserRole =
  | "CANDIDATE"
  | "RECRUITER"
  | "COMPANY_MEMBER"
  | "COMPANY_ADMIN"
  | "AGENCY_MEMBER"
  | "AGENCY_ADMIN";

export type WaitlistRole = "CANDIDATE" | "RECRUITER" | "COMPANY" | "AGENCY";

export type SubscriptionTier = "FREE" | "STARTER" | "GROWTH" | "ENTERPRISE";

export type JobStatus = "DRAFT" | "ACTIVE" | "CLOSED";

export type ApplicationStatus =
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEW"
  | "OFFER"
  | "REJECTED"
  | "PLACED";

// ============================================================
// API RESPONSE CONTRACTS
// ============================================================

export interface ApiResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ============================================================
// WAITLIST
// ============================================================

export interface WaitlistEntry {
  id: string;
  email: string;
  name?: string | null;
  role: WaitlistRole;
  referredBy?: string | null;
  createdAt: Date;
  confirmedAt?: Date | null;
}

export interface WaitlistStats {
  total: number;
  byRole: Record<WaitlistRole, number>;
}

export interface WaitlistCountResponse {
  count: number;
}

// ============================================================
// CONTACT
// ============================================================

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: Date;
}

// ============================================================
// USER, PROFILE & WORKSPACES
// ============================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  companyId?: string | null;
  agencyId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CandidateProfile {
  id: string;
  userId: string;
  headline?: string | null;
  bio?: string | null;
  skills: string[];
  experience?: any; // Structured JSON array
  education?: any;  // Structured JSON array
  verified: boolean;
  resumeUrl?: string | null;
  updatedAt: Date;
}

export interface Company {
  id: string;
  name: string;
  website?: string | null;
  logoUrl?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Agency {
  id: string;
  name: string;
  website?: string | null;
  logoUrl?: string | null;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================
// JOBS & APPLICATIONS
// ============================================================

export interface Job {
  id: string;
  title: string;
  description: string;
  department?: string | null;
  location: string;
  type: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  status: JobStatus;
  companyId: string;
  postedById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
