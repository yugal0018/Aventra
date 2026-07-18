"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Briefcase, DollarSign, MapPin, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function NewJobRequisitionPage() {
  const { toast } = useToast();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !location || !type || !description) {
      toast({
        variant: "destructive",
        title: "Validation error",
        description: "Please fill in all mandatory job parameters.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        department: department || "Engineering",
        location,
        type,
        salaryMin: salaryMin ? parseInt(salaryMin, 10) : null,
        salaryMax: salaryMax ? parseInt(salaryMax, 10) : null,
        description,
        status: "ACTIVE",
      };

      const res = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast({
          variant: "success",
          title: "Opportunity Published! 🚀",
          description: data.message || "Your new job requisition is active and visible to candidates.",
        });
        // Redirect to recruiter's Kanban board
        router.push("/dashboard/pipeline");
      } else {
        toast({
          variant: "destructive",
          title: data.error || "Submission failed",
          description: data.message || "Failed to publish job opening. Please try again.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Failed to connect to publishing server. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pt-2 select-none">
      {/* Return link */}
      <Link
        href="/dashboard/pipeline"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to pipelines
      </Link>

      <div className="max-w-3xl">
        <Card className="bg-white border-border shadow-sm">
          <CardHeader className="p-6 md:p-8 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-500 shrink-0" />
              <CardTitle className="text-lg md:text-xl font-bold tracking-tight text-foreground">
                Post New Job Requisition
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Enter the parameters of the position to publish it to candidate feeds instantly.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Row 1: Title & Department */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Job Title *</label>
                  <Input
                    placeholder="e.g. Senior Backend Engineer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-9 bg-slate-50/50 border-border/80"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Department</label>
                  <Input
                    placeholder="e.g. Engineering, Sales, Product"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="h-9 bg-slate-50/50 border-border/80"
                  />
                </div>
              </div>

              {/* Row 2: Location & Commitment */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Location *</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      placeholder="e.g. New York, NY / Remote"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-9 h-9 bg-slate-50/50 border-border/80"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Commitment *</label>
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="h-9 bg-slate-50/50 border-border/80">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Remote">Remote Only</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: Salary Bounds */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Minimum Salary (Annual USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      type="number"
                      placeholder="e.g. 100000"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(e.target.value)}
                      className="pl-9 h-9 bg-slate-50/50 border-border/80"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Maximum Salary (Annual USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      type="number"
                      placeholder="e.g. 150000"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(e.target.value)}
                      className="pl-9 h-9 bg-slate-50/50 border-border/80"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Job Description *</label>
                <Textarea
                  placeholder="Outline the role responsibilities, key parameters, requirements, and benefits..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[160px] bg-slate-50/50 border-border/80 text-xs leading-relaxed"
                  required
                />
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <Button asChild variant="outline" className="h-9 text-xs font-bold bg-white text-muted-foreground hover:text-foreground">
                  <Link href="/dashboard/pipeline">Cancel</Link>
                </Button>
                <Button type="submit" disabled={isSubmitting} className="h-9 bg-aventra-500 hover:bg-aventra-600 text-white font-bold text-xs shadow-sm">
                  {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
                  Publish Active Listing
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
