import { NextRequest, NextResponse } from "next/server";
import { forbidden, getRole, hasAtLeast } from "@/lib/auth";
import { getStore, recordAudit, ROLE_ACTOR } from "@/lib/store";
import { KycStatus } from "@/lib/types";

const TRANSITIONS: Record<string, { to: KycStatus; from: KycStatus[] }> = {
  start_review: { to: "in_review", from: ["pending"] },
  approve: { to: "approved", from: ["pending", "in_review", "escalated"] },
  reject: { to: "rejected", from: ["pending", "in_review", "escalated"] },
  escalate: { to: "escalated", from: ["pending", "in_review"] },
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const role = await getRole();
  if (!hasAtLeast(role, "approver")) return forbidden("approver", role);

  const { id } = await params;
  const body = await req.json();
  const action = body.action as string;
  const transition = TRANSITIONS[action];
  if (!transition) {
    return NextResponse.json({ error: "Unknown action", code: "unknown_action" }, { status: 400 });
  }

  const store = getStore();
  const kycCase = store.kycCases.find((c) => c.id === id);
  if (!kycCase) {
    return NextResponse.json({ error: "Case not found", code: "case_not_found" }, { status: 404 });
  }
  if (!transition.from.includes(kycCase.status)) {
    return NextResponse.json(
      {
        error: `Cannot ${action} a case in '${kycCase.status}' status.`,
        code: "invalid_transition",
        params: { action, status: kycCase.status },
      },
      { status: 409 }
    );
  }
  if ((action === "reject" || action === "escalate") && !body.notes?.trim()) {
    return NextResponse.json(
      {
        error: `A note is required to ${action} a case.`,
        code: "note_required",
        params: { action },
      },
      { status: 400 }
    );
  }

  const before = kycCase.status;
  kycCase.status = transition.to;
  if (body.notes?.trim()) kycCase.notes = body.notes.trim();

  recordAudit({
    actor: ROLE_ACTOR[role],
    role,
    app: "kyc",
    action,
    entityId: kycCase.id,
    before: `status=${before}`,
    after: `status=${kycCase.status}`,
  });

  return NextResponse.json({ case: kycCase });
}
