import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";
import { toSnakeScript } from "@/lib/transforms";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ scriptId: string }> }
) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { scriptId } = await params;
  const script = await prisma.script.findUnique({
    where: { id: parseInt(scriptId) },
    include: { sections: { orderBy: { orderIndex: "asc" } } },
  });

  if (!script) {
    return NextResponse.json({ detail: "Script not found" }, { status: 404 });
  }

  return NextResponse.json(toSnakeScript(script));
}

export async function PUT(
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

  const data: Record<string, unknown> = {};
  if (body.title !== undefined) data.title = body.title;
  if (body.description !== undefined) data.description = body.description;
  if (body.industry !== undefined) data.industry = body.industry;
  if (body.company_size !== undefined) data.companySize = body.company_size;
  if (body.target_location !== undefined) data.targetLocation = body.target_location;
  if (body.product_name !== undefined) data.productName = body.product_name;
  if (body.target_role !== undefined) data.targetRole = body.target_role;
  if (body.difficulty_level !== undefined) data.difficultyLevel = body.difficulty_level;

  const updated = await prisma.script.update({
    where: { id },
    data,
    include: { sections: { orderBy: { orderIndex: "asc" } } },
  });

  return NextResponse.json(toSnakeScript(updated));
}
