import { NextRequest, NextResponse } from "next/server";
import { forbidden, getRole, hasAtLeast } from "@/lib/auth";
import { getStore, recordAudit, ROLE_ACTOR } from "@/lib/store";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = await getRole();
  if (!hasAtLeast(role, "admin")) return forbidden("admin", role);

  const { id } = await params;
  const body = await req.json();

  const store = getStore();
  const flag = store.flags.find((f) => f.id === id);
  if (!flag) {
    return NextResponse.json({ error: "Flag not found", code: "flag_not_found" }, { status: 404 });
  }

  const changes: string[] = [];
  const before: string[] = [];

  if (typeof body.enabled === "boolean" && body.enabled !== flag.enabled) {
    before.push(`enabled=${flag.enabled}`);
    flag.enabled = body.enabled;
    changes.push(`enabled=${flag.enabled}`);
  }
  if (typeof body.rolloutPercent === "number") {
    const pct = Math.round(body.rolloutPercent);
    if (pct < 0 || pct > 100) {
      return NextResponse.json(
        { error: "Rollout must be between 0 and 100.", code: "rollout_range" },
        { status: 400 }
      );
    }
    if (pct !== flag.rolloutPercent) {
      before.push(`rollout=${flag.rolloutPercent}%`);
      flag.rolloutPercent = pct;
      changes.push(`rollout=${pct}%`);
    }
  }

  if (changes.length === 0) {
    return NextResponse.json({ flag });
  }

  flag.updatedAt = new Date().toISOString();

  recordAudit({
    actor: ROLE_ACTOR[role],
    role,
    app: "flags",
    action: "update",
    entityId: flag.id,
    before: before.join(" "),
    after: changes.join(" "),
  });

  return NextResponse.json({ flag });
}
