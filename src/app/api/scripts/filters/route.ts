import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const scripts = await prisma.script.findMany({
    select: { industry: true, companySize: true, targetLocation: true },
  });

  const industries = [...new Set(scripts.map((s) => s.industry))];
  const companySizes = [...new Set(scripts.map((s) => s.companySize))];
  const locations = [...new Set(scripts.map((s) => s.targetLocation))];

  return NextResponse.json({
    industries,
    company_sizes: companySizes,
    locations,
  });
}
