"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { MessageSquare, Send, Calendar, Briefcase, MapPin, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SkeletonText } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Maps ApplicationStatus to labels
const STATUS_LABELS: Record<string, string> = {
  APPLIED: "Applied",
  SCREENING: "In Review",
  INTERVIEW: "Interviewing",
  OFFER: "Offered",
  REJECTED: "Not Selected",
  PLACED: "Hired 🎉",
};

export default function MessagesDashboardPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isFetchingConversations, setIsFetchingConversations] = useState(true);
  const [isFetchingMessages, setIsFetchingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const currentUserId = (session?.user as any)?.id;
  const userRole = (session?.user as any)?.role;

  // Load conversations
  const loadConversations = async (silent = false) => {
    if (!silent) setIsFetchingConversations(true);
    try {
      const res = await fetch("/api/conversations");
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setConversations(result.data);
          // Auto-select first thread if none is selected
          if (result.data.length > 0 && !selectedThreadId) {
            setSelectedThreadId(result.data[0].id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to load threads:", err);
    } finally {
      setIsFetchingConversations(false);
    }
  };

  // Load messages in active thread
  const loadMessages = async (threadId: string) => {
    setIsFetchingMessages(true);
    try {
      const res = await fetch(`/api/messages?applicationId=${threadId}`);
      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setMessages(result.data);
        }
      }
    } catch (err) {
      console.error("Failed to load thread messages:", err);
    } finally {
      setIsFetchingMessages(false);
    }
  };

  useEffect(() => {
    if (session) {
      void loadConversations();
    }
  }, [session]);

  useEffect(() => {
    if (selectedThreadId) {
      void loadMessages(selectedThreadId);
    }
  }, [selectedThreadId]);

  // Scroll to bottom helper
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedThreadId) return;

    setIsSending(true);
    const content = inputText.trim();
    setInputText("");

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId: selectedThreadId, content }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Append sent message in-state instantly
        setMessages((prev) => [...prev, data.data]);
        
        // Refresh conversations in-background to update last message snippet
        void loadConversations(true);
      } else {
        toast({
          variant: "destructive",
          title: "Sending failed",
          description: data.message || "Failed to deliver message.",
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Connection error",
        description: "Failed to connect to messaging service.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const selectedThread = conversations.find((t) => t.id === selectedThreadId);

  // Helper to resolve thread display labels
  const getThreadMeta = (thread: any) => {
    if (userRole === "CANDIDATE") {
      return {
        name: thread.job?.company?.name || "Corporate Partner",
        title: thread.job?.title,
        headline: thread.job?.location || "Remote",
      };
    }
    return {
      name: thread.candidate?.name || "Job Seeker",
      title: thread.job?.title,
      headline: thread.candidate?.candidateProfile?.headline || "Aventra Professional",
    };
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row border border-border bg-white rounded-xl overflow-hidden shadow-sm select-none">
      {/* Left panel: Threads Sidebar */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-border flex flex-col shrink-0 bg-slate-50/50">
        <div className="p-4 border-b border-border flex items-center justify-between gap-2 shrink-0 bg-white">
          <div className="flex items-center gap-1.5">
            <MessageSquare className="h-4.5 w-4.5 text-aventra-600" />
            <span className="text-sm font-bold text-foreground">Conversations</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => void loadConversations()}
            className="h-7 w-7 text-muted-foreground hover:text-foreground bg-white border border-slate-200 shadow-sm"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Conversation logs list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {isFetchingConversations ? (
            <div className="p-4"><SkeletonText lines={4} /></div>
          ) : conversations.length > 0 ? (
            conversations.map((thread) => {
              const meta = getThreadMeta(thread);
              const isSelected = thread.id === selectedThreadId;
              const lastMsgText = thread.lastMessage?.content || "No messages yet.";

              return (
                <div
                  key={thread.id}
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors duration-150 flex items-start gap-3 ${
                    isSelected ? "bg-aventra-50 text-aventra-900" : "hover:bg-slate-100/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Avatar className="h-9 w-9 shrink-0 border border-slate-200 shadow-sm">
                    <AvatarFallback className="bg-slate-200 text-slate-700 text-xs font-bold font-mono">
                      {meta.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-bold truncate ${isSelected ? "text-aventra-800" : "text-foreground"}`}>
                        {meta.name}
                      </p>
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground/80 truncate leading-none">
                      {meta.title}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate leading-normal pt-1">
                      {lastMsgText}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16 px-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-xs font-bold text-foreground">No chats found</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">Submit applications to unlock active chat channels.</p>
            </div>
          )}
        </div>
      </div>

      {/* Right panel: Chat Stream Window */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {selectedThread ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between gap-4 shrink-0 bg-slate-50/20">
              <div className="min-w-0 flex items-center gap-3">
                <Avatar className="h-9 w-9 border border-slate-200">
                  <AvatarFallback className="bg-aventra-100 text-aventra-800 text-xs font-bold">
                    {getThreadMeta(selectedThread).name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-foreground leading-none">
                    {getThreadMeta(selectedThread).name}
                  </h3>
                  <p className="text-[9.5px] font-semibold text-muted-foreground truncate mt-0.5">
                    {getThreadMeta(selectedThread).headline}
                  </p>
                </div>
              </div>

              {/* Thread Context Badge */}
              <div className="shrink-0 flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2 py-0.5">
                  {STATUS_LABELS[selectedThread.status] || selectedThread.status}
                </Badge>
              </div>
            </div>

            {/* Chat message streams bubble */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-50/30">
              {isFetchingMessages ? (
                <div className="space-y-4"><SkeletonText lines={5} /></div>
              ) : messages.length > 0 ? (
                messages.map((msg) => {
                  const isOwnMessage = msg.senderId === currentUserId;
                  const time = new Date(msg.createdAt).toLocaleTimeString(undefined, {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <div key={msg.id} className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] space-y-0.5`}>
                        <div
                          className={`p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                            isOwnMessage
                              ? "bg-aventra-500 text-white rounded-br-none"
                              : "bg-white border border-border text-slate-800 rounded-bl-none"
                          }`}
                        >
                          {msg.content}
                        </div>
                        <p className={`text-[9px] text-muted-foreground/70 ${isOwnMessage ? "text-right" : "text-left"}`}>
                          {time}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-20">
                  <MessageSquare className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-xs font-bold text-foreground">Write first message</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Initialize alignment on job requirements.</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom input area */}
            <div className="p-4 border-t border-border shrink-0 bg-white">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 h-10 text-xs bg-slate-50 border-border/80"
                  disabled={isSending}
                  required
                />
                <Button type="submit" disabled={isSending || !inputText.trim()} className="bg-aventra-500 hover:bg-aventra-600 text-white h-10 w-10 shrink-0 shadow-sm p-0">
                  {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none">
            <MessageSquare className="h-12 w-12 text-muted-foreground/20 mb-3" />
            <h3 className="text-sm font-bold text-foreground">Select a thread</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
              Choose a candidate thread or employer conversation from the left sidebar to start messaging.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
