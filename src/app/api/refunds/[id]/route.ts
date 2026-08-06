import { NextRequest, NextResponse } from "next/server";
import { forbidden, getRole, hasAtLeast } from "@/lib/auth";
import { getStore, recordAudit, ROLE_ACTOR } from "@/lib/store";
import { RefundStatus, Role } from "@/lib/types";

const TRANSITIONS: Record<
  string,
  { to: RefundStatus; from: RefundStatus[]; requires: Role }
> = {
  approve: { to: "approved", from: ["requested"], requires: "approver" },
  reject: { to: "rejected", from: ["requested"], requires: "approver" },
  process: { to: "processed", from: ["approved"], requires: "admin" },
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const transition = TRANSITIONS[body.action as string];
  if (!transition) {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }

  const role = await getRole();
  if (!hasAtLeast(role, transition.requires)) {
    return forbidden(transition.requires, role);
  }

  const store = getStore();
  const refund = store.refunds.find((r) => r.id === id);
  if (!refund) {
    return NextResponse.json({ error: "Refund not found" }, { status: 404 });
  }
  if (!transition.from.includes(refund.status)) {
    return NextResponse.json(
      { error: `Cannot ${body.action} a refund in '${refund.status}' status.` },
      { status: 409 }
    );
  }
  if (refund.amount > 1000 && body.action === "approve" && role !== "admin") {
    return NextResponse.json(
      { error: "Refunds over 1,000 require an admin to approve." },
      { status: 403 }
    );
  }

  const before = refund.status;
  refund.status = transition.to;

  recordAudit({
    actor: ROLE_ACTOR[role],
    role,
    app: "refunds",
    action: body.action,
    entityId: refund.id,
    before: `status=${before}`,
    after: `status=${refund.status}`,
  });

  return NextResponse.json({ refund });
}
