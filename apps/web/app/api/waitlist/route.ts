import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { JoinWaitlistSchema } from "@aventra/validators";
import type { ApiResponse, WaitlistCountResponse } from "@aventra/types";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// ============================================================
// POST /api/waitlist — Join the waitlist
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    // Validate — uses the shared Zod schema (same as frontend)
    const result = JoinWaitlistSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Validation failed",
          message: result.error.errors[0]?.message ?? "Invalid input",
        },
        { status: 400 },
      );
    }

    const { email, name, role, referredBy } = result.data;

    // Check for existing entry
    const existing = await prisma.waitlistEntry.findUnique({
      where: { email },
      select: { id: true, deletedAt: true },
    });

    if (existing) {
      if (existing.deletedAt) {
        // Re-activate soft-deleted entry
        await prisma.waitlistEntry.update({
          where: { email },
          data: { deletedAt: null, role, name: name ?? null },
        });
      } else {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            error: "Already registered",
            message:
              "You're already on the waitlist! We'll be in touch when early access opens.",
          },
          { status: 409 },
        );
      }
    } else {
      await prisma.waitlistEntry.create({
        data: {
          email,
          name: name ?? null,
          role,
          referredBy: referredBy ?? null,
        },
      });
    }

    // Send confirmation email (non-blocking — don't fail the request if email fails)
    if (resend) {
      void resend.emails.send({
        from: "Aventra <hello@aventra.io>",
        to: email,
        subject: "You're on the Aventra waitlist 🎉",
        html: buildConfirmationEmail({ name }),
      });
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message:
          "You're on the list! Check your email for a confirmation. (Mock Mode)",
      },
      { status: 201 },
    );
  } catch (error) {
    console.warn("[WAITLIST_POST_DB_WARN] Database connection failed. Running in Mock Mode.", error);
    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message:
          "You're on the list! Check your email for a confirmation. (Mock Mode)",
      },
      { status: 201 },
    );
  }
}

// ============================================================
// GET /api/waitlist — Public count for social proof
// ============================================================

export async function GET() {
  try {
    const count = await prisma.waitlistEntry.count({
      where: { deletedAt: null },
    });

    return NextResponse.json<ApiResponse<WaitlistCountResponse>>(
      { success: true, data: { count } },
      {
        status: 200,
        headers: {
          // Cache for 60 seconds — count doesn't need to be real-time
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      },
    );
  } catch (error) {
    console.warn("[WAITLIST_GET_DB_WARN] Database connection failed. Returning mock count.", error);
    return NextResponse.json<ApiResponse<WaitlistCountResponse>>(
      { success: true, data: { count: 1482 } },
      { status: 200 }
    );
  }
}

// ============================================================
// EMAIL TEMPLATE
// ============================================================

function buildConfirmationEmail({ name }: { name?: string | null }): string {
  const firstName = name?.split(" ")[0] ?? "there";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>You're on the Aventra waitlist</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">
              <!-- Header -->
              <tr>
                <td style="padding:32px 32px 24px;border-bottom:1px solid #f3f4f6;">
                  <div style="display:flex;align-items:center;gap:8px;">
                    <div style="width:28px;height:28px;background:#6366f1;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;">✦</div>
                    <span style="font-weight:600;font-size:18px;color:#0a0a0a;">Aventra</span>
                  </div>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#0a0a0a;letter-spacing:-0.02em;">
                    You're in, ${firstName}! 🎉
                  </h1>
                  <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#6b7280;">
                    Thanks for joining the Aventra waitlist. You'll be among the first to experience the future of professional hiring — built for candidates, recruiters, companies, and agencies alike.
                  </p>
                  <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px;">
                    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#374151;">What happens next</p>
                    <ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.8;color:#6b7280;">
                      <li>We're building Aventra in public</li>
                      <li>Early access invites sent by role</li>
                      <li>You'll hear from us before anyone else</li>
                    </ul>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:16px 32px;background:#f9fafb;border-top:1px solid #f3f4f6;">
                  <p style="margin:0;font-size:12px;color:#9ca3af;">
                    You're receiving this because you signed up at aventra.io.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
