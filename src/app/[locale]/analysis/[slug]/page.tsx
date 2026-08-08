import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArchitectureView } from "@/components/ArchitectureView";
import { EvaluationView } from "@/components/EvaluationView";
import { RecommendationView } from "@/components/RecommendationView";
import { ResearchView } from "@/components/ResearchView";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const VIEWS: Record<string, React.ComponentType> = {
  research: ResearchView,
  evaluation: EvaluationView,
  recommendation: RecommendationView,
  architecture: ArchitectureView,
};

function AnalysisNav({
  active,
  labels,
}: {
  active: string;
  labels: (key: string) => string;
}) {
  return (
    <div className="mb-6 flex gap-2 text-sm">
      {Object.keys(VIEWS).map((key) => (
        <Link
          key={key}
          href={`/analysis/${key}`}
          className={cn(
            "rounded-md px-3 py-1.5 transition-colors",
            key === active
              ? "bg-primary text-primary-foreground"
              : "bg-card text-muted-foreground hover:bg-muted"
          )}
        >
          {labels(key)}
        </Link>
      ))}
    </div>
  );
}

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    Object.keys(VIEWS).map((slug) => ({ locale, slug }))
  );
}

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("analysis");
  const View = VIEWS[slug];
  if (!View) notFound();

  return (
    <div>
      <AnalysisNav active={slug} labels={t} />
      <View />
    </div>
  );
}
