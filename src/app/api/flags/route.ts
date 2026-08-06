import { NextRequest, NextResponse } from "next/server";
import { forbidden, getRole, hasAtLeast } from "@/lib/auth";
import { getStore, recordAudit, ROLE_ACTOR } from "@/lib/store";
import { FeatureFlag, FlagEnvironment } from "@/lib/types";

export async function GET() {
  return NextResponse.json({ flags: getStore().flags });
}

const ENVIRONMENTS: FlagEnvironment[] = ["development", "staging", "production"];
const KEY_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

export async function POST(req: NextRequest) {
  const role = await getRole();
  if (!hasAtLeast(role, "admin")) return forbidden("admin", role);

  const body = await req.json();
  const key = String(body.key ?? "").trim();
  const description = String(body.description ?? "").trim();
  const environment = body.environment as FlagEnvironment;
  const owner = String(body.owner ?? "").trim();

  if (!KEY_PATTERN.test(key)) {
    return NextResponse.json(
      { error: "Key must be kebab-case (e.g. 'new-payment-flow')." },
      { status: 400 }
    );
  }
  if (!description) {
    return NextResponse.json({ error: "Description is required." }, { status: 400 });
  }
  if (!ENVIRONMENTS.includes(environment)) {
    return NextResponse.json({ error: "Invalid environment." }, { status: 400 });
  }
  if (!owner) {
    return NextResponse.json({ error: "Owner is required." }, { status: 400 });
  }

  const store = getStore();
  if (store.flags.some((f) => f.key === key && f.environment === environment)) {
    return NextResponse.json(
      { error: `Flag '${key}' already exists in ${environment}.` },
      { status: 409 }
    );
  }

  store.counter += 1;
  const flag: FeatureFlag = {
    id: `FLG-${store.counter}`,
    key,
    description,
    enabled: false,
    environment,
    rolloutPercent: 0,
    owner,
    updatedAt: new Date().toISOString(),
  };
  store.flags.unshift(flag);

  recordAudit({
    actor: ROLE_ACTOR[role],
    role,
    app: "flags",
    action: "create",
    entityId: flag.id,
    before: null,
    after: `key=${key} env=${environment}`,
  });

  return NextResponse.json({ flag }, { status: 201 });
}
