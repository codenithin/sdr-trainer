import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password, full_name } = body;

  if (!email || !password || !full_name) {
    return NextResponse.json(
      { detail: "Email, password, and full_name are required" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { detail: "Email already registered" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, hashedPassword, fullName: full_name },
  });

  return NextResponse.json(
    {
      id: user.id,
      email: user.email,
      full_name: user.fullName,
      is_active: user.isActive,
      created_at: user.createdAt.toISOString(),
    },
    { status: 201 }
  );
}
