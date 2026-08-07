import { Link } from "@/i18n/navigation";
import { ArrowRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Tile {
  href: string;
  title: string;
  description: string;
  cta: string;
}

const APPS: Tile[] = [
  {
    href: "/apps/kyc",
    title: "KYC Review Queue",
    description:
      "Work through pending identity checks. Approve, reject, or escalate — rejections and escalations always require a note.",
    cta: "Open the Queue",
  },
  {
    href: "/apps/refunds",
    title: "Refunds Dashboard",
    description:
      "See open exposure at a glance, decide on requests, and process approved payouts. Refunds over 1,000 need an admin.",
    cta: "Review Refunds",
  },
  {
    href: "/apps/flags",
    title: "Feature-Flag Admin",
    description:
      "Toggle flags and dial rollout percentages per environment. Every change is admin-only and lands in the audit log.",
    cta: "Manage Flags",
  },
];

const ANALYSIS: Tile[] = [
  {
    href: "/analysis/research",
    title: "Research",
    description:
      "What Power Apps actually provides, and which slice of it this team pays $250K/year for.",
    cta: "Read the Research",
  },
  {
    href: "/analysis/evaluation",
    title: "Evaluation",
    description:
      "What ~2 hours of building replicated, what it didn't, and what closing the gap would really cost.",
    cta: "Read the Evaluation",
  },
  {
    href: "/analysis/recommendation",
    title: "Recommendation",
    description:
      "The build-vs-buy call, with the reasoning laid out so you can disagree with it productively.",
    cta: "Read the Recommendation",
  },
];

function CardGrid({ items }: { items: Tile[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className="group">
          <Card className="h-full transition-colors group-hover:border-primary/50">
            <CardHeader>
              <CardTitle className="text-balance">{item.title}</CardTitle>
              <CardDescription className="text-pretty">
                {item.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className="mt-auto">
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                {item.cta}
                <ArrowRightIcon
                  aria-hidden="true"
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </CardFooter>
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
        <Badge variant="secondary" className="mb-3">
          Build-vs-Buy Assessment
        </Badge>
        <h1 className="text-balance text-3xl font-semibold tracking-tight">
          Could Two Hours of Building Replace a $250K/Year Platform?
        </h1>
        <p className="mt-3 max-w-3xl text-pretty text-muted-foreground">
          A Series C fintech with ~60 engineers runs three internal apps on
          Microsoft Power Apps. This prototype rebuilds their capability core —
          data grids, validated forms, role-based access control, and a full
          audit trail — so the build-vs-buy decision rests on evidence, not
          guesswork.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Try it: switch between Viewer, Approver, and Admin in the top-right
          and watch what each role can and can&apos;t do.
        </p>
      </div>

      <h2 className="mb-4 text-lg font-semibold">The Three Internal Apps</h2>
      <CardGrid items={APPS} />

      <h2 className="mb-4 mt-10 text-lg font-semibold">The Assessment</h2>
      <CardGrid items={ANALYSIS} />

      <p className="mt-10 text-sm text-muted-foreground">
        Prototype note: data lives in memory and reseeds on cold starts — a
        deliberate scope cut, discussed in the evaluation.
      </p>
    </div>
  );
}
