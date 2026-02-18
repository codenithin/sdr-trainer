import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();
  const { script_id, persona_id } = body;

  const script = await prisma.script.findUnique({ where: { id: script_id } });
  if (!script) {
    return NextResponse.json({ detail: "Script not found" }, { status: 404 });
  }

  const persona = await prisma.persona.findUnique({ where: { id: persona_id } });
  if (!persona) {
    return NextResponse.json({ detail: "Persona not found" }, { status: 404 });
  }

  const session = await prisma.roleplaySession.create({
    data: {
      userId: user.id,
      scriptId: script_id,
      personaId: persona_id,
    },
  });

  return NextResponse.json(
    {
      id: session.id,
      script_id: session.scriptId,
      persona_id: session.personaId,
      started_at: session.startedAt.toISOString(),
      is_active: session.isActive,
      script_title: script.title,
      persona_name: persona.name,
      persona_emoji: persona.avatarEmoji,
      messages: [],
    },
    { status: 201 }
  );
}

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const sessions = await prisma.roleplaySession.findMany({
    where: { userId: user.id },
    orderBy: { startedAt: "desc" },
    include: { script: true, persona: true },
  });

  return NextResponse.json(
    sessions.map((s) => ({
      id: s.id,
      script_id: s.scriptId,
      persona_id: s.personaId,
      started_at: s.startedAt.toISOString(),
      ended_at: s.endedAt?.toISOString() ?? null,
      is_active: s.isActive,
      feedback_summary: s.feedbackSummary,
      script_title: s.script?.title ?? null,
      persona_name: s.persona?.name ?? null,
    }))
  );
}
