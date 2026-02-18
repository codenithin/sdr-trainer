import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";
import { toSnakePersona } from "@/lib/transforms";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const personas = await prisma.persona.findMany();
  return NextResponse.json(personas.map(toSnakePersona));
}
