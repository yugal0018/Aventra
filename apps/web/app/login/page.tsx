"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { ArrowLeft, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LoginUserSchema } from "@aventra/validators";

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Email verification resend states
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resending, setResending] = useState(false);

  // Check URL query parameters securely in useEffect (prevents build-time deoptimization)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("verified") === "true") {
        toast({
          variant: "success",
          title: "Account Verified! 🎉",
          description: "Your email has been verified. You can now log in.",
        });
      }

      const error = params.get("error");
      if (error === "ExpiredToken") {
        const emailParam = params.get("email");
        if (emailParam) setUnverifiedEmail(emailParam);
        toast({
          variant: "destructive",
          title: "Link Expired",
          description: "Your verification link has expired. Please request a new one.",
        });
      } else if (error === "InvalidToken") {
        toast({
          variant: "destructive",
          title: "Invalid Link",
          description: "This verification link is invalid or has already been used.",
        });
      }
    }
  }, [toast]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    setUnverifiedEmail(null);

    // Validate using Zod schema
    const validationResult = LoginUserSchema.safeParse({ email, password });

    if (!validationResult.success) {
      const errors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path[0]) {
          errors[err.path[0].toString()] = err.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setIsLoading(true);
    try {
      // Call NextAuth Credentials Provider sign-in
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        if (res.error === "EmailNotVerified") {
          setUnverifiedEmail(email);
          toast({
            variant: "destructive",
            title: "Verification Required",
            description: "Please verify your email address before logging in.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Authorization Failed",
            description: "Incorrect email or password.",
          });
        }
      } else {
        toast({
          variant: "success",
          title: "Authorized! 🔐",
          description: "Accessing dashboard console...",
        });
        // Redirect to central dashboard route
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Failed to connect to authentication server. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!unverifiedEmail) return;

    setResending(true);
    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: unverifiedEmail }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast({
          variant: "success",
          title: "Verification Email Sent 📬",
          description: "Please check your email address for a fresh verification link.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Resend Failed",
          description: data.message || "Failed to resend verification email.",
        });
      }
    } catch {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Failed to connect to verification server.",
      });
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4 py-12">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-[400px] w-[400px] rounded-full bg-aventra-500/5 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to homepage
        </Link>

        <Card className="shadow-xl border-border bg-white">
          <CardHeader className="space-y-1.5 text-center">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-aventra-500 text-white shadow-sm mb-2">
              <Lock className="h-5 w-5" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Access Aventra Console</CardTitle>
            <CardDescription>
              Enter your email and credentials to enter your console.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="login-email">Email Address</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={fieldErrors.email}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <Label htmlFor="login-password">Password</Label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      toast({
                        variant: "info",
                        description: "Password recovery details will be sent in active beta."
                      });
                    }}
                    className="text-xs text-aventra-600 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={fieldErrors.password}
                  required
                />
              </div>

              {/* Inactivity resend alert UI */}
              {unverifiedEmail && (
                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 text-xs space-y-2">
                  <p className="font-bold text-amber-800">Email Verification Required</p>
                  <p className="text-slate-600 leading-normal">
                    Please verify your email address to log in. If you did not receive the verification email, you can request a new one below:
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={resending}
                    onClick={handleResendEmail}
                    className="w-full text-xs font-bold border-amber-300 text-amber-800 hover:bg-amber-100/50 h-9 rounded-xl flex items-center justify-center gap-1.5"
                  >
                    {resending ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : null}
                    Resend Verification Email
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-aventra-500 text-white hover:bg-aventra-600 h-10 mt-2 rounded-xl font-bold"
              >
                {isLoading ? "Signing in..." : "Log In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Don't have a platform pass yet? <Link href="/signup" className="text-aventra-600 hover:underline font-medium">Register account</Link>
        </p>
      </div>
    </div>
  );
}
