import { prisma } from "@/lib/prisma";

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}

/**
 * Checks if a key has exceeded the allowed number of hits within a window.
 * key: Unique string identifying the action & identity (e.g. "resend:user@email.com" or "register:192.168.1.1")
 * limit: Maximum allowed hits within the window
 * windowMs: Window size in milliseconds
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<RateLimitResult> {
  const now = new Date();
  const expiresAt = new Date(now.getTime() + windowMs);

  try {
    // Upsert rate limit record in a transaction to prevent race conditions
    const result = await prisma.$transaction(async (tx) => {
      // Find current rate limit record
      const record = await tx.rateLimit.findUnique({
        where: { key },
      });

      if (!record) {
        // Create new record
        const newRecord = await tx.rateLimit.create({
          data: {
            key,
            hits: 1,
            expiresAt,
          },
        });
        return newRecord;
      }

      // Check if expired
      if (now > record.expiresAt) {
        // Reset record
        const resetRecord = await tx.rateLimit.update({
          where: { key },
          data: {
            hits: 1,
            expiresAt,
            createdAt: now,
          },
        });
        return resetRecord;
      }

      // Increment hits
      const updatedRecord = await tx.rateLimit.update({
        where: { key },
        data: {
          hits: { increment: 1 },
        },
      });
      return updatedRecord;
    });

    const remaining = Math.max(0, limit - result.hits);
    const success = result.hits <= limit;

    return {
      success,
      limit,
      remaining,
      reset: result.expiresAt,
    };
  } catch (error) {
    console.error("Rate limiter database transaction failed. Bypassing check.", error);
    // Graceful fallback: allow requests if rate limiter database fails
    return {
      success: true,
      limit,
      remaining: 1,
      reset: expiresAt,
    };
  }
}

/**
 * Cleans up expired rate limit records from the database
 */
export async function cleanupExpiredRateLimits() {
  try {
    const now = new Date();
    await prisma.rateLimit.deleteMany({
      where: {
        expiresAt: { lt: now },
      },
    });
  } catch (err) {
    console.error("Failed to sweep expired rate limit records:", err);
  }
}
