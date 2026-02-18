import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { sessionId } = await params;
  const session = await prisma.roleplaySession.findFirst({
    where: { id: parseInt(sessionId), userId: user.id },
    include: {
      script: true,
      persona: true,
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!session) {
    return NextResponse.json({ detail: "Session not found" }, { status: 404 });
  }

  return NextResponse.json({
    id: session.id,
    script_id: session.scriptId,
    persona_id: session.personaId,
    started_at: session.startedAt.toISOString(),
    ended_at: session.endedAt?.toISOString() ?? null,
    is_active: session.isActive,
    feedback_summary: session.feedbackSummary,
    script_title: session.script?.title ?? null,
    persona_name: session.persona?.name ?? null,
    persona_emoji: session.persona?.avatarEmoji ?? null,
    messages: session.messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      created_at: m.createdAt.toISOString(),
    })),
  });
}
