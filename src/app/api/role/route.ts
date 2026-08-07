import { NextRequest, NextResponse } from "next/server";
import { getRole, ROLE_COOKIE, ROLES } from "@/lib/auth";
import { Role } from "@/lib/types";

export async function GET() {
  return NextResponse.json({ role: await getRole() });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const role = body.role as Role;
  if (!ROLES.includes(role)) {
    return NextResponse.json({ error: "Invalid role", code: "invalid_role" }, { status: 400 });
  }
  const res = NextResponse.json({ role });
  res.cookies.set(ROLE_COOKIE, role, { path: "/" });
  return res;
}
