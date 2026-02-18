import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";
import { getAiResponse } from "@/lib/openai/roleplay-service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { sessionId } = await params;
  const sid = parseInt(sessionId);
  const body = await req.json();

  const session = await prisma.roleplaySession.findFirst({
    where: { id: sid, userId: user.id },
    include: { persona: true, script: true },
  });

  if (!session) {
    return NextResponse.json({ detail: "Session not found" }, { status: 404 });
  }
  if (!session.isActive) {
    return NextResponse.json({ detail: "Session has ended" }, { status: 400 });
  }

  // Save user message
  const userMsg = await prisma.roleplayMessage.create({
    data: { sessionId: sid, role: "user", content: body.content },
  });

  // Get history for AI context
  const history = await prisma.roleplayMessage.findMany({
    where: { sessionId: sid },
    orderBy: { createdAt: "asc" },
  });

  let aiContent: string;
  try {
    aiContent = await getAiResponse(
      session.persona,
      session.script,
      history.slice(0, -1).map((m) => ({ role: m.role, content: m.content })),
      body.content
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg.includes("insufficient_quota")) {
      return NextResponse.json(
        { detail: "OpenAI quota exceeded. Please add credits at platform.openai.com/settings/organization/billing" },
        { status: 502 }
      );
    }
    return NextResponse.json(
      { detail: `AI service error: ${msg.substring(0, 200)}` },
      { status: 502 }
    );
  }

  const aiMsg = await prisma.roleplayMessage.create({
    data: { sessionId: sid, role: "assistant", content: aiContent },
  });

  return NextResponse.json({
    user_message: {
      id: userMsg.id,
      role: userMsg.role,
      content: userMsg.content,
      created_at: userMsg.createdAt.toISOString(),
    },
    ai_message: {
      id: aiMsg.id,
      role: aiMsg.role,
      content: aiMsg.content,
      created_at: aiMsg.createdAt.toISOString(),
    },
  });
}
