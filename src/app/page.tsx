import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const APPS = [
  {
    href: "/apps/kyc",
    title: "KYC Review Queue",
    description:
      "Review pending identity checks, approve, reject, or escalate cases. Approver role required for decisions.",
  },
  {
    href: "/apps/refunds",
    title: "Refunds Dashboard",
    description:
      "Track refund requests, approve or reject them, and process approved payouts. Large refunds and processing require admin.",
  },
  {
    href: "/apps/flags",
    title: "Feature-Flag Admin Panel",
    description:
      "Toggle flags, adjust rollout percentages, and create new flags. All changes are admin-only and audited.",
  },
];

const ANALYSIS = [
  { href: "/analysis/research", title: "Research", description: "What Power Apps does and where its value lies." },
  { href: "/analysis/evaluation", title: "Evaluation", description: "What this prototype replicated, what it couldn't, and the gap." },
  { href: "/analysis/recommendation", title: "Recommendation", description: "The build-vs-buy recommendation and its reasoning." },
];

function CardGrid({ items }: { items: typeof APPS }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Link key={item.href} href={item.href}>
          <Card className="h-full transition hover:border-primary/50">
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">
          Power Apps Replacement Prototype
        </h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          A ~2-hour prototype built with Devin to assess whether a Series C
          fintech (~60 engineers, $250K/year internal-tool platform spend) could
          replace Microsoft Power Apps with a lightweight in-house alternative.
          It replicates the capability core their three internal apps rely on:
          data grids, validated forms, role-based access control, and a full
          audit trail. Use the role switcher in the top-right to see RBAC in
          action.
        </p>
      </div>

      <h2 className="mb-4 text-lg font-semibold">The three internal apps</h2>
      <CardGrid items={APPS} />

      <h2 className="mb-4 mt-10 text-lg font-semibold">The assessment</h2>
      <CardGrid items={ANALYSIS} />

      <p className="mt-10 text-sm text-muted-foreground">
        Prototype note: data lives in memory and reseeds on cold starts — a
        deliberate scope cut, discussed in the evaluation.
      </p>
    </div>
  );
}
