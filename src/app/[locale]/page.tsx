import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
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
      <div className="mb-10">
        <Badge variant="secondary" className="mb-3">
          {t("badge")}
        </Badge>
        <h1 className="text-balance text-3xl font-semibold tracking-tight">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-3xl text-pretty text-muted-foreground">
          {t("intro")}
        </p>
        <p className="mt-3 text-sm text-muted-foreground">{t("tryIt")}</p>
      </div>

      <h2 className="mb-4 text-lg font-semibold">{t("appsHeading")}</h2>
      <CardGrid items={apps} />

      <h2 className="mb-4 mt-10 text-lg font-semibold">
        {t("assessmentHeading")}
      </h2>
      <CardGrid items={analysis} />

      <p className="mt-10 text-sm text-muted-foreground">
        {t("prototypeNote")}
      </p>
    </div>
  );
}
