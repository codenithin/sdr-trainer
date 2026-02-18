import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";
import { toSnakePersona } from "@/lib/transforms";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ personaId: string }> }
) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { personaId } = await params;
  const persona = await prisma.persona.findUnique({
    where: { id: parseInt(personaId) },
  });

  if (!persona) {
    return NextResponse.json({ detail: "Persona not found" }, { status: 404 });
  }

  return NextResponse.json(toSnakePersona(persona));
}
