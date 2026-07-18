import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ApiResponse } from "@aventra/types";

// ============================================================
// INITIALIZE SHARED GLOBAL MOCK MESSAGES STORE
// Mapped by applicationId key to group thread content
// ============================================================
if (!(global as any)._mockMessages) {
  (global as any)._mockMessages = {
    "mock-app-id-1": [
      {
        id: "mock-msg-1",
        applicationId: "mock-app-id-1",
        senderId: "mock-candidate-user-1",
        content: "Hi, I submitted my Next.js and Tailwind CSS portfolio. Excited to connect!",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        id: "mock-msg-2",
        applicationId: "mock-app-id-1",
        senderId: "mock-recruiter-id",
        content: "Excellent code style. Verified Github credentials match. Let's set up some time to chat.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      }
    ],
    "mock-app-id-3": [
      {
        id: "mock-msg-3",
        applicationId: "mock-app-id-3",
        senderId: "mock-candidate-user-1",
        content: "Applied via candidate job portal.",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      }
    ]
  };
}

// ============================================================
// GET /api/messages — Fetch all messages in a thread
// ============================================================

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);

  if (!session?.user) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Unauthorized", message: "Log in to view messages." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const applicationId = searchParams.get("applicationId");

  if (!applicationId) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Bad request", message: "applicationId parameter is required." },
      { status: 400 }
    );
  }

  try {
    const messages = await prisma.message.findMany({
      where: { applicationId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json<ApiResponse<any>>(
      { success: true, data: messages },
      { status: 200 }
    );
  } catch (error) {
    console.warn("[MESSAGES_GET_DB_WARN] Database connection offline. Returning mock thread messages.", error);

    const mockMsgs = (global as any)._mockMessages || {};
    const threadMsgs = mockMsgs[applicationId] || [];

    return NextResponse.json<ApiResponse<any>>(
      { success: true, data: threadMsgs },
      { status: 200 }
    );
  }
}

// ============================================================
// POST /api/messages — Send a message in a thread
// ============================================================

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions).catch(() => null);

  if (!session?.user) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Unauthorized", message: "Log in to send messages." },
      { status: 401 }
    );
  }

  const userId = (session.user as any).id;

  let body: any = {};
  try {
    body = await request.json();
  } catch (err) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Invalid JSON", message: "Failed to parse JSON body request." },
      { status: 400 }
    );
  }

  const { applicationId, content } = body;

  if (!applicationId || !content?.trim()) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Bad request", message: "applicationId and content are required." },
      { status: 400 }
    );
  }

  try {
    // Insert Message record
    const message = await prisma.message.create({
      data: {
        applicationId,
        content: content.trim(),
        senderId: userId,
      }
    });

    // Also push to mock store for hot-reloads
    if (!(global as any)._mockMessages[applicationId]) {
      (global as any)._mockMessages[applicationId] = [];
    }
    (global as any)._mockMessages[applicationId].push(message);

    return NextResponse.json<ApiResponse<any>>(
      { success: true, message: "Message sent!", data: message },
      { status: 201 }
    );
  } catch (error) {
    console.warn("[MESSAGES_POST_DB_WARN] Database connection offline. Appending to mock messages store.", error);

    const mockMessage = {
      id: `mock-msg-${Date.now()}`,
      applicationId,
      senderId: userId,
      content: content.trim(),
      createdAt: new Date(),
    };

    if (!(global as any)._mockMessages) {
      (global as any)._mockMessages = {};
    }
    if (!(global as any)._mockMessages[applicationId]) {
      (global as any)._mockMessages[applicationId] = [];
    }

    (global as any)._mockMessages[applicationId].push(mockMessage);

    return NextResponse.json<ApiResponse<any>>(
      {
        success: true,
        message: "Message sent! (Mock Mode)",
        data: mockMessage,
      },
      { status: 201 }
    );
  }
}
