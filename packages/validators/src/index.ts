// ============================================================
// AVENTRA — Shared Zod Validators
// Used on both frontend (form validation) and backend (API validation)
// This is the single source of truth for all input shapes.
// ============================================================

import { z } from "zod";

// ============================================================
// COMMON
// ============================================================

export const EmailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .max(255, "Email is too long")
  .toLowerCase()
  .trim();

export const NameSchema = z
  .string()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be under 100 characters")
  .trim();

export const PasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password is too long");

// ============================================================
// WAITLIST
// ============================================================

export const WaitlistRoleSchema = z.enum([
  "CANDIDATE",
  "RECRUITER",
  "COMPANY",
  "AGENCY",
]);

export const JoinWaitlistSchema = z.object({
  email: EmailSchema,
  name: NameSchema.optional(),
  role: WaitlistRoleSchema.default("CANDIDATE"),
  referredBy: z.string().uuid("Invalid referral code").optional(),
});

export type JoinWaitlistInput = z.infer<typeof JoinWaitlistSchema>;
export type WaitlistRole = z.infer<typeof WaitlistRoleSchema>;

// ============================================================
// AUTHENTICATION
// ============================================================

export const UserRoleSchema = z.enum([
  "CANDIDATE",
  "RECRUITER",
  "COMPANY_MEMBER",
  "COMPANY_ADMIN",
  "AGENCY_MEMBER",
  "AGENCY_ADMIN",
]);

export const RegisterUserSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  name: NameSchema,
  role: UserRoleSchema.default("CANDIDATE"),
});

export const LoginUserSchema = z.object({
  email: EmailSchema,
  password: z.string().min(1, "Password is required"),
});

export type RegisterUserInput = z.infer<typeof RegisterUserSchema>;
export type LoginUserInput = z.infer<typeof LoginUserSchema>;

// ============================================================
// PROFILE BUILDER
// ============================================================

export const CandidateProfileSchema = z.object({
  headline: z.string().max(200, "Headline is too long").optional().nullable(),
  bio: z.string().max(2000, "Bio is too long").optional().nullable(),
  skills: z.array(z.string().min(1)).min(1, "At least one skill is required"),
  experience: z.any().optional(), // Dynamic structured array validation is done inline
  education: z.any().optional(),
  resumeUrl: z.string().url("Invalid resume link format").optional().nullable().or(z.literal("")),
});

export type CandidateProfileInput = z.infer<typeof CandidateProfileSchema>;

// ============================================================
// JOBS & APPLICATIONS
// ============================================================

export const JobStatusSchema = z.enum(["DRAFT", "ACTIVE", "CLOSED"]);

export const CreateJobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title is too long"),
  description: z.string().min(10, "Provide a comprehensive description"),
  department: z.string().max(100).optional().nullable(),
  location: z.string().min(2, "Location is required"),
  type: z.string().min(2, "Select job commitment type (e.g. Remote, Full-time)"),
  salaryMin: z.number().int().nonnegative().optional().nullable(),
  salaryMax: z.number().int().nonnegative().optional().nullable(),
  status: JobStatusSchema.default("DRAFT"),
});

export type CreateJobInput = z.infer<typeof CreateJobSchema>;

export const ApplicationStatusSchema = z.enum([
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "PLACED",
]);

export const UpdateApplicationStatusSchema = z.object({
  status: ApplicationStatusSchema,
  notes: z.string().max(1000).optional().nullable(),
});

export type UpdateApplicationStatusInput = z.infer<typeof UpdateApplicationStatusSchema>;

// ============================================================
// CONTACT FORM
// ============================================================

export const ContactFormSchema = z.object({
  name: NameSchema,
  email: EmailSchema,
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters")
    .max(200, "Subject is too long")
    .trim(),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must be under 2000 characters")
    .trim(),
});

export type ContactFormInput = z.infer<typeof ContactFormSchema>;
