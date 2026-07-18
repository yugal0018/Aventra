"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Sparkles, Mail, Clock, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Section, SectionHeader } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ContactFormSchema } from "@aventra/validators";

export default function ContactPage() {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    // Validate using Zod schema
    const validationResult = ContactFormSchema.safeParse({ name, email, subject, message });

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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          variant: "success",
          title: "Message Sent! ✉️",
          description: data.message || "Thank you for reaching out. We will get back to you shortly.",
        });
        setName("");
        setEmail("");
        setSubject("");
        setMessage("");
      } else {
        toast({
          variant: "destructive",
          title: data.error || "Failed to send message",
          description: data.message || "Please check your inputs and try again.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Failed to connect to server. Please check your internet connection.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 bg-indigo-500/5 blur-[100px]" />

      {/* Hero Header */}
      <Section size="lg" className="pt-24 lg:pt-32 text-center max-w-3xl mx-auto">
        <Reveal direction="up" delay={0.05}>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1.5 text-xs font-semibold text-indigo-700 mb-6">
            <Sparkles className="h-3.5 w-3.5" /> Contact
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <h1 className="text-display-lg font-bold tracking-tight text-foreground sm:text-display-xl">
            Get in touch with us.
          </h1>
        </Reveal>

        <Reveal direction="up" delay={0.15}>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance">
            Questions about our platform, enterprise agency licenses, or early beta pass codes? Send us a message.
          </p>
        </Reveal>
      </Section>

      {/* Contact Content Grid */}
      <Section size="lg" className="bg-slate-50/50 border-t border-border">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Contact Details Card */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-white border-border/80">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-lg font-bold text-foreground">Aventra Support Desk</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Have questions about waitlist priorities, features, or partnership integrations? Reach out to our founders.
                </p>

                <div className="space-y-4 pt-2">
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-foreground">Direct Email</p>
                      <p className="text-xs text-muted-foreground">hello@aventra.io</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-foreground">Average Response Time</p>
                      <p className="text-xs text-muted-foreground">Within 24 hours (Monday to Friday)</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MessageSquare className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-foreground">Media & Partners</p>
                      <p className="text-xs text-muted-foreground">media@aventra.io</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form Card */}
          <div className="lg:col-span-7">
            <Card className="bg-white border-border/80 shadow-sm">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="contact-name">Your Name</Label>
                      <Input
                        id="contact-name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={fieldErrors.name}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="contact-email">Professional Email</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="john@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={fieldErrors.email}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-subject">Subject</Label>
                    <Input
                      id="contact-subject"
                      placeholder="How can we help you?"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      error={fieldErrors.subject}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="contact-message">Message</Label>
                    <Textarea
                      id="contact-message"
                      placeholder="Please details your question, feature request, or corporate size..."
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      error={fieldErrors.message}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-aventra-500 hover:bg-aventra-600 text-white h-10 w-full sm:w-auto"
                  >
                    {isLoading ? "Sending message..." : "Send Message"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>
    </div>
  );
}
