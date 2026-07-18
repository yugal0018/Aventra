import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { ContactFormSchema } from "@aventra/validators";
import type { ApiResponse } from "@aventra/types";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// ============================================================
// POST /api/contact — Handle contact form submissions
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();

    // Validate using shared Zod schema
    const result = ContactFormSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          error: "Validation failed",
          message: result.error.errors[0]?.message ?? "Invalid input parameters",
        },
        { status: 400 },
      );
    }

    const { name, email, subject, message } = result.data;

    // In a real application, you might write this to a database.
    // For the waitlist phase, we log it and email the founders.
    console.info(`[CONTACT_SUBMISSION] Name: ${name}, Email: ${email}, Subject: ${subject}`);
    console.info(`Message: ${message}`);

    // Send notification email to founders (non-blocking)
    if (resend) {
      void resend.emails.send({
        from: "Aventra Contact Form <hello@aventra.io>",
        to: "founders@aventra.io", // Send to founder desk
        subject: `New Contact Submission: ${subject}`,
        html: `
          <h3>New Inquiry from Aventra website</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <blockquote style="background:#f4f4f5;padding:12px;border-left:4px solid #6366f1;">
            ${message.replace(/\n/g, "<br>")}
          </blockquote>
        `,
      });
    }

    return NextResponse.json<ApiResponse>(
      {
        success: true,
        message: "Message sent successfully! We'll get back to you shortly.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[CONTACT_POST]", error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Failed to submit message. Please try again." },
      { status: 500 },
    );
  }
}
