"use client";

import React, { useState, useEffect } from "react";
import { Sparkles, Shield, User, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { SkeletonText } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CandidateProfileInput } from "@aventra/validators";

export default function CandidateProfilePage() {
  const { toast } = useToast();

  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Fetch initial profile parameters
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            const profile = result.data;
            setHeadline(profile.headline || "");
            setBio(profile.bio || "");
            setSkillsInput(profile.skills ? profile.skills.join(", ") : "");
            setResumeUrl(profile.resumeUrl || "");
          }
        }
      } catch (err) {
        console.error("Failed to load profile data:", err);
      } finally {
        setIsFetching(false);
      }
    }
    void loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setFieldErrors({});

    // Parse comma-separated skills input into array
    const skills = skillsInput
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (skills.length === 0) {
      setFieldErrors({ skills: "Please list at least one skill." });
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          headline: headline || null,
          bio: bio || null,
          skills,
          resumeUrl: resumeUrl || null,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          variant: "success",
          title: "Profile Saved! ✦",
          description: data.message || "Your candidate profile parameters have been updated.",
        });
      } else {
        toast({
          variant: "destructive",
          title: data.error || "Save failed",
          description: data.message || "Please check your parameters.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Failed to connect to profile server. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };



  if (isFetching) {
    return (
      <div className="space-y-6 pt-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Loading Profile...</h1>
        <Card className="bg-white border-border">
          <CardContent className="p-8 space-y-6">
            <SkeletonText lines={5} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pt-2 select-none">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Candidate Profile Workspace</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Customize your credentials for candidate searches.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left column: Form */}
        <div className="lg:col-span-8">
          <Card className="bg-white border-border shadow-sm">
            <CardHeader>
              <CardTitle>Dossier Profile</CardTitle>
              <CardDescription>Provide details about your technical competencies and experience levels.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="prof-headline">Professional Headline</Label>
                  <Input
                    id="prof-headline"
                    placeholder="e.g. Senior Full Stack Engineer"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prof-bio">Biography / Summary</Label>
                  <Textarea
                    id="prof-bio"
                    placeholder="Detail your professional highlights..."
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prof-skills">Skills (comma-separated list)</Label>
                  <Input
                    id="prof-skills"
                    placeholder="e.g. TypeScript, React, Next.js, Postgres"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    error={fieldErrors.skills}
                    required
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">List competencies separated by commas.</p>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="prof-resume">Resume / Portfolio URL</Label>
                  <Input
                    id="prof-resume"
                    type="url"
                    placeholder="https://github.com/profile"
                    value={resumeUrl}
                    onChange={(e) => setResumeUrl(e.target.value)}
                  />
                </div>

                <Button type="submit" disabled={isSaving} className="bg-aventra-500 hover:bg-aventra-600 text-white h-10 gap-1.5 mt-2">
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save Profile Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Account Security Info */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="bg-white border-border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-bold">Account Security</CardTitle>
              <Shield className="h-4 w-4 text-indigo-500" />
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4 text-center space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700">Email Verification</span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-bold text-foreground">Verified & Secure</p>
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Your email address is verified. This unlocks dashboard operations and guarantees secure login parameters.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
