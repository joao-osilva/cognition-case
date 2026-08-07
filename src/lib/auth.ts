import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Role } from "./types";

const ROLE_COOKIE = "demo-role";
const ROLES: Role[] = ["viewer", "approver", "admin"];

export async function getRole(): Promise<Role> {
  const store = await cookies();
  const value = store.get(ROLE_COOKIE)?.value;
  return ROLES.includes(value as Role) ? (value as Role) : "viewer";
}

const RANK: Record<Role, number> = { viewer: 0, approver: 1, admin: 2 };

export function hasAtLeast(role: Role, required: Role): boolean {
  return RANK[role] >= RANK[required];
}

export function forbidden(required: Role, role: Role): NextResponse {
  return NextResponse.json(
    {
      error: `This action requires the '${required}' role or higher. You are currently '${role}'.`,
      code: "forbidden",
      params: { required, role },
    },
    { status: 403 }
  );
}

export { ROLE_COOKIE, ROLES };
