import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";
import { toSnakeScript } from "@/lib/transforms";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ scriptId: string; sectionId: string }> }
) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { scriptId, sectionId } = await params;
  const body = await req.json();

  const section = await prisma.scriptSection.findFirst({
    where: { id: parseInt(sectionId), scriptId: parseInt(scriptId) },
  });
  if (!section) {
    return NextResponse.json({ detail: "Section not found" }, { status: 404 });
  }

  const data: Record<string, unknown> = {};
  if (body.section_type !== undefined) data.sectionType = body.section_type;
  if (body.title !== undefined) data.title = body.title;
  if (body.content !== undefined) data.content = body.content;
  if (body.tips !== undefined) data.tips = body.tips;
  if (body.order_index !== undefined) data.orderIndex = body.order_index;
  if (body.talking_points !== undefined) {
    data.talkingPoints = Array.isArray(body.talking_points)
      ? JSON.stringify(body.talking_points)
      : body.talking_points;
  }

  await prisma.scriptSection.update({
    where: { id: parseInt(sectionId) },
    data,
  });

  const updated = await prisma.script.findUnique({
    where: { id: parseInt(scriptId) },
    include: { sections: { orderBy: { orderIndex: "asc" } } },
  });

  return NextResponse.json(toSnakeScript(updated));
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ scriptId: string; sectionId: string }> }
) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { scriptId, sectionId } = await params;

  const section = await prisma.scriptSection.findFirst({
    where: { id: parseInt(sectionId), scriptId: parseInt(scriptId) },
  });
  if (!section) {
    return NextResponse.json({ detail: "Section not found" }, { status: 404 });
  }

  await prisma.scriptSection.delete({ where: { id: parseInt(sectionId) } });

  const updated = await prisma.script.findUnique({
    where: { id: parseInt(scriptId) },
    include: { sections: { orderBy: { orderIndex: "asc" } } },
  });

  return NextResponse.json(toSnakeScript(updated));
}
