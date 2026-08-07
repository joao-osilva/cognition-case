import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRightIcon,
  ClipboardCheckIcon,
  FlagIcon,
  MousePointerClickIcon,
  ReceiptIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

const APP_ICONS = [ClipboardCheckIcon, ReceiptIcon, FlagIcon];

function HeroCollage({
  t,
}: {
  t: Awaited<ReturnType<typeof getTranslations<"home">>>;
}) {
  const bars = [35, 55, 40, 70, 52, 80, 62];
  return (
    <div aria-hidden="true" className="relative hidden min-h-80 lg:block">
      <div className="absolute left-0 top-2 w-72 -rotate-2 rounded-xl border bg-card p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-semibold">{t("kycTitle")}</span>
          <Badge variant="secondary">3</Badge>
        </div>
        <div className="flex flex-col gap-2">
          {[
            ["AC", "Amara Chen", "pending"],
            ["LM", "Lucas Meyer", "in review"],
            ["SO", "Sofia Okafor", "escalated"],
          ].map(([initials, name, status]) => (
            <div
              key={name}
              className="flex items-center gap-2.5 rounded-lg bg-muted/60 px-2.5 py-2"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                {initials}
              </span>
              <span className="flex-1 truncate text-xs font-medium">
                {name}
              </span>
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute right-0 top-24 w-64 rotate-3 rounded-xl border bg-card p-4 shadow-xl">
        <div className="text-xs text-muted-foreground">
          {t("collageExposure")}
        </div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-2xl font-semibold tabular-nums">$12,450</span>
          <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            −18% {t("collageThisWeek")}
          </span>
        </div>
        <div className="mt-3 flex h-16 items-end gap-1.5">
          {bars.map((h, i) => (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className="flex-1 rounded-sm bg-primary/70"
            />
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 left-16 flex w-60 -rotate-1 items-center gap-3 rounded-xl border bg-card px-4 py-3 shadow-xl">
        <span className="relative inline-flex h-5 w-9 shrink-0 items-center rounded-full bg-primary">
          <span className="absolute right-0.5 size-4 rounded-full bg-primary-foreground" />
        </span>
        <div className="min-w-0">
          <div className="truncate font-mono text-xs font-medium">
            new-onboarding-flow
          </div>
          <div className="text-[10px] text-muted-foreground">
            production · 75%
          </div>
        </div>
      </div>
    </div>
  );
}

function TileCard({ item, number }: { item: Tile; number?: string }) {
  const Icon = number ? APP_ICONS[Number(number) - 1] : undefined;
  return (
    <Link href={item.href} className="group">
      <Card className="h-full transition-all group-hover:-translate-y-0.5 group-hover:border-primary/50 group-hover:shadow-md motion-reduce:transition-none motion-reduce:group-hover:translate-y-0">
        <CardHeader>
          {number && Icon && (
            <div className="mb-2 flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon aria-hidden="true" className="size-4.5" />
              </span>
              <span className="text-sm font-semibold tabular-nums text-muted-foreground/50">
                0{number}
              </span>
            </div>
          )}
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
              className="size-3.5 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const apps: Tile[] = [
    {
      href: "/apps/kyc",
      title: t("kycTitle"),
      description: t("kycDescription"),
      cta: t("kycCta"),
    },
    {
      href: "/apps/refunds",
      title: t("refundsTitle"),
      description: t("refundsDescription"),
      cta: t("refundsCta"),
    },
    {
      href: "/apps/flags",
      title: t("flagsTitle"),
      description: t("flagsDescription"),
      cta: t("flagsCta"),
    },
  ];

  const analysis: Tile[] = [
    {
      href: "/analysis/research",
      title: t("researchTitle"),
      description: t("researchDescription"),
      cta: t("researchCta"),
    },
    {
      href: "/analysis/evaluation",
      title: t("evaluationTitle"),
      description: t("evaluationDescription"),
      cta: t("evaluationCta"),
    },
    {
      href: "/analysis/recommendation",
      title: t("recommendationTitle"),
      description: t("recommendationDescription"),
      cta: t("recommendationCta"),
    },
  ];

  const stats = [
    { value: t("stat1Value"), label: t("stat1Label") },
    { value: t("stat2Value"), label: t("stat2Label") },
    { value: t("stat3Value"), label: t("stat3Label") },
    { value: t("stat4Value"), label: t("stat4Label") },
  ];

  return (
    <div>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div>
          <Badge variant="secondary" className="mb-4">
            {t("badge")}
          </Badge>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-muted-foreground">
            {t("intro")}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/apps/kyc">
                {t("heroCtaPrimary")}
                <ArrowRightIcon aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full"
            >
              <Link href="/analysis/recommendation">
                {t("heroCtaSecondary")}
              </Link>
            </Button>
          </div>
          <div className="mt-6 flex items-start gap-2.5 rounded-xl border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            <MousePointerClickIcon
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-primary"
            />
            <p className="text-pretty">{t("tryIt")}</p>
          </div>
        </div>
        <HeroCollage t={t} />
      </div>

      <dl className="mt-12 grid grid-cols-2 gap-6 border-y py-6 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col gap-1">
            <dd className="order-1 text-2xl font-semibold tabular-nums tracking-tight">
              {s.value}
            </dd>
            <dt className="order-2 text-sm text-muted-foreground">
              {s.label}
            </dt>
          </div>
        ))}
      </dl>

      <h2 className="mb-4 mt-12 text-xl font-semibold tracking-tight">
        {t("appsHeading")}
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {apps.map((item, i) => (
          <TileCard key={item.href} item={item} number={String(i + 1)} />
        ))}
      </div>

      <section className="mt-12 rounded-2xl border bg-muted/40 p-6 sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight">
          {t("assessmentHeading")}
        </h2>
        <p className="mt-2 max-w-2xl text-pretty text-sm text-muted-foreground">
          {t("assessmentIntro")}
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {analysis.map((item) => (
            <TileCard key={item.href} item={item} />
          ))}
        </div>
      </section>

      <p className="mt-10 text-sm text-muted-foreground">
        {t("prototypeNote")}
      </p>
    </div>
  );
}
