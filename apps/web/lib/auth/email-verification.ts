import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

/**
 * Generates a secure verification token valid for 15 minutes
 */
export async function generateVerificationToken(email: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Remove existing tokens for this email
  await prisma.verificationToken.deleteMany({
    where: { email },
  });

  const verificationToken = await prisma.verificationToken.create({
    data: {
      email,
      token,
      expiresAt,
    },
  });

  return verificationToken;
}

/**
 * Sends a professional verification email to the user
 */
export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const verifyUrl = `${baseUrl}/api/auth/verify?token=${token}`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Aventra Account</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; padding: 24px; margin: 0; }
        .card { max-w: 500px; margin: 0 auto; background: #ffffff; border: 1px border #e2e8f0; border-radius: 16px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
        .logo { font-size: 20px; font-weight: bold; color: #6366f1; text-decoration: none; margin-bottom: 24px; display: inline-block; }
        h1 { font-size: 22px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 12px; }
        p { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px; }
        .btn { display: inline-block; background-color: #6366f1; color: #ffffff !important; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-size: 14px; margin-bottom: 24px; text-align: center; }
        .btn:hover { background-color: #4f46e5; }
        .footer { font-size: 11px; color: #94a3b8; line-height: 1.4; border-top: 1px solid #f1f5f9; pt-16px; margin-top: 24px; }
        .link { color: #6366f1; word-break: break-all; }
      </style>
    </head>
    <body>
      <div class="card">
        <a href="${baseUrl}" class="logo">Aventra</a>
        <h1>Verify your email address</h1>
        <p>Thanks for joining Aventra! Before you can log in and access your workspace dashboard, please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center;">
          <a href="${verifyUrl}" class="btn">Verify Email Address</a>
        </div>
        
        <p>This verification link will expire in <strong>15 minutes</strong>. If you did not sign up for an Aventra account, you can safely ignore this email.</p>
        
        <div class="footer">
          <p>If you're having trouble with the button, copy and paste the URL below into your web browser:</p>
          <a href="${verifyUrl}" class="link">${verifyUrl}</a>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await resend.emails.send({
      from: "Aventra <onboarding@resend.dev>",
      to: email,
      subject: "Verify Your Aventra Account 🛡️",
      html: htmlContent,
    });
    return { success: true, id: response.data?.id };
  } catch (err) {
    console.error("Failed to send verification email:", err);
    return { success: false, error: err };
  }
}
