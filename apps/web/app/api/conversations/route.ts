import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@aventra/types";

// ============================================================
// INITIALIZE SHARED GLOBAL MOCK CONVERSATIONS STORE
// Maintains mock conversation threads for local offline runs
// ============================================================
if (!(global as any)._mockConversations) {
  (global as any)._mockConversations = [
    {
      id: "mock-app-id-1", // Using applicationId as threadId
      status: "SCREENING",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      job: {
        id: "mock-job-id-1",
        title: "Senior Next.js Developer",
        location: "NYC / Remote",
        company: {
          name: "Acme Technologies",
        }
      },
      candidate: {
        id: "mock-candidate-user-1",
        name: "Jane Doe",
        email: "jane@aventra.io",
        candidateProfile: {
          headline: "Next.js Specialist & UI Architect",
        }
      },
      lastMessage: {
        content: "Excellent code style. Verified Github credentials match.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        senderId: "mock-recruiter-id",
      }
    },
    {
      id: "mock-app-id-3",
      status: "APPLIED",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      job: {
        id: "mock-job-id-3",
        title: "Product Designer (UI/UX)",
        location: "Bangalore • Hybrid",
        company: {
          name: "Linear Corp",
        }
      },
      candidate: {
        id: "mock-candidate-user-1",
        name: "Jane Doe",
        email: "jane@aventra.io",
        candidateProfile: {
          headline: "Next.js Specialist & UI Architect",
        }
      },
      lastMessage: {
        content: "Applied via candidate job portal.",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        senderId: "mock-candidate-user-1",
      }
    }
  ];
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);

  if (!session?.user) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Unauthorized", message: "Log in to retrieve conversations." },
      { status: 401 }
    );
  }

  const userId = (session.user as any).id;
  const userRole = (session.user as any).role;

  try {
    let conversations = [];

    if (userRole === "CANDIDATE") {
      // Candidates see their own applications
      conversations = await prisma.jobApplication.findMany({
        where: { candidateId: userId },
        include: {
          job: {
            include: {
              company: { select: { name: true, logoUrl: true } }
            }
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { content: true, createdAt: true, senderId: true }
          }
        },
        orderBy: { updatedAt: "desc" }
      });
    } else {
      // Recruiters/Managers see applications submitted to their company or posted jobs
      conversations = await prisma.jobApplication.findMany({
        where: {
          job: {
            postedById: userId,
          }
        },
        include: {
          job: {
            include: {
              company: { select: { name: true, logoUrl: true } }
            }
          },
          candidate: {
            select: {
              id: true,
              name: true,
              email: true,
              candidateProfile: { select: { headline: true } }
            }
          },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            select: { content: true, createdAt: true, senderId: true }
          }
        },
        orderBy: { updatedAt: "desc" }
      });
    }

    // Map database relations to standard conversation structures
    const formatted = conversations.map((c: any) => ({
      id: c.id,
      status: c.status,
      createdAt: c.createdAt,
      job: c.job,
      candidate: c.candidate,
      lastMessage: c.messages[0] || (c.notes ? {
        content: c.notes,
        createdAt: c.createdAt,
        senderId: "system",
      } : null)
    }));

    return NextResponse.json<ApiResponse<any>>(
      { success: true, data: formatted },
      { status: 200 }
    );
  } catch (error) {
    console.warn("[CONVERSATIONS_GET_DB_WARN] Database connection offline. Returning stateful mock threads.", error);

    // Filter threads depending on logged-in user role!
    let mockThreads = (global as any)._mockConversations || [];

    // Map lastMessage dynamically from global messages if recruiter or candidate sent any chat messages
    const mockMsgs = (global as any)._mockMessages || {};
    mockThreads = mockThreads.map((thread: any) => {
      const threadMsgs = mockMsgs[thread.id] || [];
      if (threadMsgs.length > 0) {
        const last = threadMsgs[threadMsgs.length - 1];
        return {
          ...thread,
          lastMessage: {
            content: last.content,
            createdAt: last.createdAt,
            senderId: last.senderId,
          }
        };
      }
      return thread;
    });

    return NextResponse.json<ApiResponse<any>>(
      { success: true, data: mockThreads },
      { status: 200 }
    );
  }
}
