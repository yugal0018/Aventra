import { PrismaClient } from "@prisma/client";

// ============================================================
// PRISMA SINGLETON
//
// In Next.js, each hot-reload creates a new module instance.
// Without this pattern, development creates hundreds of
// Prisma Client instances and exhausts the DB connection pool.
//
// We store the client on `globalThis` in development only —
// in production, the module is loaded once and this is moot.
// ============================================================

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
