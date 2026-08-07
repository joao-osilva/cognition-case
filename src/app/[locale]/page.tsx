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

  return (
    <div>
      <div className="border-b pb-10">
        <Badge variant="secondary" className="mb-4">
          {t("badge")}
        </Badge>
        <h1 className="max-w-3xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-3xl text-pretty text-muted-foreground">
          {t("intro")}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild size="lg">
            <Link href="/apps/kyc">
              {t("heroCtaPrimary")}
              <ArrowRightIcon aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/analysis/recommendation">{t("heroCtaSecondary")}</Link>
          </Button>
        </div>
        <div className="mt-6 flex max-w-3xl items-start gap-2.5 rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          <MousePointerClickIcon
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-primary"
          />
          <p className="text-pretty">{t("tryIt")}</p>
        </div>
      </div>

      <h2 className="mb-4 mt-10 text-xl font-semibold tracking-tight">
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
