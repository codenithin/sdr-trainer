import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";
import { toSnakeScript } from "@/lib/transforms";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ scriptId: string }> }
) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { scriptId } = await params;
  const id = parseInt(scriptId);
  const body = await req.json();

  const script = await prisma.script.findUnique({ where: { id } });
  if (!script) {
    return NextResponse.json({ detail: "Script not found" }, { status: 404 });
  }

  const talkingPoints = Array.isArray(body.talking_points)
    ? JSON.stringify(body.talking_points)
    : body.talking_points || null;

  await prisma.scriptSection.create({
    data: {
      scriptId: id,
      sectionType: body.section_type,
      title: body.title,
      content: body.content || "",
      talkingPoints,
      tips: body.tips || "",
      orderIndex: body.order_index ?? 0,
    },
  });

  const updated = await prisma.script.findUnique({
    where: { id },
    include: { sections: { orderBy: { orderIndex: "asc" } } },
  });

  return NextResponse.json(toSnakeScript(updated));
}
