import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/auth-helpers";
import { toSnakeScript } from "@/lib/transforms";
import { generateScriptFromProspect } from "@/lib/openai/script-generator";

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const industry = searchParams.get("industry");
  const companySize = searchParams.get("company_size");
  const location = searchParams.get("location");
  const search = searchParams.get("search");

  const where: Record<string, unknown> = {};
  if (industry) where.industry = industry;
  if (companySize) where.companySize = companySize;
  if (location) where.targetLocation = { contains: location };
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
    ];
  }

  const scripts = await prisma.script.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(
    scripts.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      industry: s.industry,
      company_size: s.companySize,
      target_location: s.targetLocation,
      product_name: s.productName,
      target_role: s.targetRole,
      difficulty_level: s.difficultyLevel,
      created_at: s.createdAt.toISOString(),
    }))
  );
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const body = await req.json();

  try {
    const result = await generateScriptFromProspect({
      prospectName: body.prospect_name,
      prospectTitle: body.prospect_title,
      prospectCompany: body.prospect_company,
      industry: body.industry,
      companySize: body.company_size,
      location: body.location,
      linkedinSummary: body.linkedin_summary,
      additionalContext: body.additional_context,
    });

    const sections = (result.sections as Array<Record<string, unknown>>) || [];

    const script = await prisma.script.create({
      data: {
        title: result.title as string,
        description: result.description as string,
        industry: (result.industry as string) || body.industry || "general",
        companySize: (result.company_size as string) || body.company_size || "mid_market",
        targetLocation: (result.target_location as string) || body.location || "US",
        productName: (result.product_name as string) || "Nvelop",
        targetRole: (result.target_role as string) || body.prospect_title,
        difficultyLevel: (result.difficulty_level as string) || "intermediate",
        sections: {
          create: sections.map((sec) => ({
            sectionType: (sec.section_type as string) || "intro",
            title: (sec.title as string) || "",
            content: (sec.content as string) || "",
            talkingPoints: Array.isArray(sec.talking_points)
              ? JSON.stringify(sec.talking_points)
              : (sec.talking_points as string) || null,
            tips: (sec.tips as string) || "",
            orderIndex: (sec.order_index as number) || 0,
          })),
        },
      },
      include: { sections: { orderBy: { orderIndex: "asc" } } },
    });

    return NextResponse.json(toSnakeScript(script));
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json(
      { detail: `AI generation failed: ${msg}` },
      { status: 500 }
    );
  }
}
