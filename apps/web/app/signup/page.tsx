"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { RegisterUserSchema } from "@aventra/validators";
import { UserRole } from "@aventra/types";

export default function SignupPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("CANDIDATE");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Validate using Zod schema
    const validationResult = RegisterUserSchema.safeParse({ email, name, password, role });

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
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, password, role }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          variant: "success",
          title: "Account Created! 🎉",
          description: "Your Aventra credentials are locked in.",
        });
        setIsSuccess(true);
      } else {
        toast({
          variant: "destructive",
          title: data.error || "Signup failed",
          description: data.message || "Please check your inputs and try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Failed to connect to registration server. Please try again later.",
      });
    } finally {
      setIsLoading(false);
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
              <Sparkles className="h-5 w-5" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Create Aventra Account</CardTitle>
            <CardDescription>
              Register your credentials to access candidate profiles or recruiter workspaces.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-0">
            {!isSuccess ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    error={fieldErrors.name}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-email">Work Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={fieldErrors.email}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={fieldErrors.password}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-role">I am registering as a</Label>
                  <Select value={role} onValueChange={(val) => setRole(val as UserRole)}>
                    <SelectTrigger id="signup-role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CANDIDATE">Candidate / Job Seeker</SelectItem>
                      <SelectItem value="RECRUITER">Independent Recruiter</SelectItem>
                      <SelectItem value="COMPANY_ADMIN">Company Hiring Lead (Corporate)</SelectItem>
                      <SelectItem value="AGENCY_ADMIN">Agency Placement Director (Partner)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-aventra-500 text-white hover:bg-aventra-600 h-10 mt-2"
                >
                  {isLoading ? "Creating account..." : "Register Platform Pass"}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4 py-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 mb-2">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Registration Complete!</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Your credentials have been successfully registered. You can now log in to access your dashboard consoles.
                </p>
                <Button asChild className="w-full mt-4 bg-aventra-500 text-white hover:bg-aventra-600">
                  <Link href="/login">Log In to Console</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Already have an active account? <Link href="/login" className="text-aventra-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
