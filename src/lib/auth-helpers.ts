import { auth } from "./auth";
import { NextResponse } from "next/server";

export async function getAuthUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }
  const { id: _, ...rest } = session.user;
  return { id: parseInt(session.user.id), ...rest };
}

export function unauthorized() {
  return NextResponse.json({ detail: "Not authenticated" }, { status: 401 });
}
