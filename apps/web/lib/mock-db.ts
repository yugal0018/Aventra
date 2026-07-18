import fs from "fs";
import path from "path";

// Path to store mock database file in the project folder
const MOCK_DB_PATH = path.join(process.cwd(), "mock_db.json");

// Helper to read data from JSON file
function readDb(): any {
  try {
    if (fs.existsSync(MOCK_DB_PATH)) {
      const data = fs.readFileSync(MOCK_DB_PATH, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("[MOCK_DB_READ_ERROR]", err);
  }
  return {};
}

// Helper to write data to JSON file
function writeDb(data: any) {
  try {
    fs.writeFileSync(MOCK_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("[MOCK_DB_WRITE_ERROR]", err);
  }
}

// Exported getter and setter for applications
export function getMockApplications(): any[] {
  const db = readDb();
  if (!db.applications) {
    db.applications = [
      {
        id: "mock-app-id-1",
        jobId: "mock-job-id-1",
        candidateId: "mock-candidate-user-1",
        status: "SCREENING",
        notes: "Excellent code style. Verified Github credentials match.",
        candidate: {
          id: "mock-candidate-user-1",
          name: "Jane Doe",
          email: "jane.dev@aventra-mock.com",
          candidateProfile: {
            headline: "Next.js Specialist & UI Architect",
            bio: "Proven track record building high-performance serverless apps.",
            skills: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
            verified: true,
          },
        },
      },
      {
        id: "mock-app-id-2",
        jobId: "mock-job-id-1",
        candidateId: "mock-candidate-user-2",
        status: "APPLIED",
        notes: "Applied via waitlist pass link.",
        candidate: {
          id: "mock-candidate-user-2",
          name: "Marcus Aurelius",
          email: "marcus.coder@aventra-mock.com",
          candidateProfile: {
            headline: "Full Stack Engineer",
            bio: "Building robust databases and Node.js APIs.",
            skills: ["JavaScript", "React", "PostgreSQL", "Prisma"],
            verified: false,
          },
        },
      },
    ];
    writeDb(db);
  }
  return db.applications;
}

export function saveMockApplications(applications: any[]) {
  const db = readDb();
  db.applications = applications;
  writeDb(db);
}

// Exported getter and setter for jobs
export function getMockJobs(): any[] {
  const db = readDb();
  if (!db.jobs) {
    db.jobs = [
      {
        id: "mock-job-id-1",
        title: "Senior Next.js Developer",
        description: "Responsible for engineering responsive React web architectures and design token integrations.",
        department: "Engineering",
        location: "NYC / Remote",
        type: "Full-Time",
        salaryMin: 120000,
        salaryMax: 160000,
        status: "ACTIVE",
        companyId: "mock-company-id-123",
        postedById: "mock-user-id-123",
        createdAt: new Date().toISOString(),
        company: {
          name: "Aventra Partners",
          logoUrl: null,
          website: "https://aventra.io",
        }
      }
    ];
    writeDb(db);
  }
  return db.jobs;
}

export function saveMockJobs(jobs: any[]) {
  const db = readDb();
  db.jobs = jobs;
  writeDb(db);
}

// Exported getter and setter for candidates
export function getMockCandidates(): any[] {
  const db = readDb();
  if (!db.candidates) {
    db.candidates = [
      {
        id: "mock-candidate-user-1",
        name: "Jane Doe",
        email: "jane.dev@aventra-mock.com",
        role: "CANDIDATE",
        candidateProfile: {
          headline: "Next.js Specialist & UI Architect",
          bio: "Proven track record building high-performance serverless apps.",
          skills: ["TypeScript", "React", "Next.js", "Tailwind CSS"],
          yearsExperience: 5,
          preferredLocations: ["Remote", "NYC"],
          verified: true,
        },
      },
      {
        id: "mock-candidate-user-2",
        name: "Marcus Aurelius",
        email: "marcus.coder@aventra-mock.com",
        role: "CANDIDATE",
        candidateProfile: {
          headline: "Full Stack Engineer",
          bio: "Building robust databases and Node.js APIs.",
          skills: ["JavaScript", "React", "PostgreSQL", "Prisma", "Node.js"],
          yearsExperience: 3,
          preferredLocations: ["Remote"],
          verified: false,
        },
      },
      {
        id: "mock-candidate-user-3",
        name: "Julius Caesar",
        email: "caesar.infra@aventra-mock.com",
        role: "CANDIDATE",
        candidateProfile: {
          headline: "DevOps & Cloud Engineer",
          bio: "Scaling infrastructure and Kubernetes clusters on AWS.",
          skills: ["Docker", "Kubernetes", "AWS", "Go", "Python"],
          yearsExperience: 6,
          preferredLocations: ["NYC"],
          verified: true,
        },
      },
      {
        id: "mock-candidate-user-4",
        name: "Cleopatra",
        email: "cleo.junior@aventra-mock.com",
        role: "CANDIDATE",
        candidateProfile: {
          headline: "Junior Backend Developer",
          bio: "Passionate about API development, learning Python and SQL.",
          skills: ["Python", "SQL", "HTML", "CSS"],
          yearsExperience: 1,
          preferredLocations: ["Remote"],
          verified: false,
        },
      },
    ];
    writeDb(db);
  }
  return db.candidates;
}

export function saveMockCandidates(candidates: any[]) {
  const db = readDb();
  db.candidates = candidates;
  writeDb(db);
}

