import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";
import { getSessionFeedback } from "@/lib/openai/roleplay-service";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { sessionId } = await params;
  const sid = parseInt(sessionId);

  const session = await prisma.roleplaySession.findFirst({
    where: { id: sid, userId: user.id },
    include: { script: true, persona: true, messages: { orderBy: { createdAt: "asc" } } },
  });

  if (!session) {
    return NextResponse.json({ detail: "Session not found" }, { status: 404 });
  }
  if (!session.isActive) {
    return NextResponse.json({ detail: "Session already ended" }, { status: 400 });
  }

  let feedbackSummary: string | null = null;
  if (session.messages.length > 0) {
    try {
      feedbackSummary = await getSessionFeedback(
        session.messages.map((m) => ({ role: m.role, content: m.content }))
      );
    } catch {
      feedbackSummary = "Feedback generation failed. Please try again.";
    }
  }

  const updated = await prisma.roleplaySession.update({
    where: { id: sid },
    data: { isActive: false, endedAt: new Date(), feedbackSummary },
    include: {
      script: true,
      persona: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  return NextResponse.json({
    id: updated.id,
    script_id: updated.scriptId,
    persona_id: updated.personaId,
    started_at: updated.startedAt.toISOString(),
    ended_at: updated.endedAt?.toISOString() ?? null,
    is_active: updated.isActive,
    feedback_summary: updated.feedbackSummary,
    script_title: updated.script?.title ?? null,
    persona_name: updated.persona?.name ?? null,
    persona_emoji: updated.persona?.avatarEmoji ?? null,
    messages: updated.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      created_at: m.createdAt.toISOString(),
    })),
  });
}
