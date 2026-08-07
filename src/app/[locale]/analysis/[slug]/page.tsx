import fs from "fs/promises";
import path from "path";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { marked } from "marked";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const DOCS: Record<string, { file: string }> = {
  research: { file: "research.md" },
  evaluation: { file: "evaluation.md" },
  recommendation: { file: "recommendation.md" },
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    Object.keys(DOCS).map((slug) => ({ locale, slug }))
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
  const doc = DOCS[slug];
  if (!doc) notFound();

  let markdown: string;
  try {
    markdown = await fs.readFile(
      path.join(process.cwd(), "docs", locale, doc.file),
      "utf-8"
    );
  } catch {
    try {
      markdown = await fs.readFile(
        path.join(process.cwd(), "docs", doc.file),
        "utf-8"
      );
    } catch {
      notFound();
    }
  }

  const html = await marked.parse(markdown);

  return (
    <div>
      <div className="mb-6 flex gap-2 text-sm">
        {Object.keys(DOCS).map((key) => (
          <Link
            key={key}
            href={`/analysis/${key}`}
            className={cn(
              "rounded-md px-3 py-1.5",
              key === slug
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            {t(key)}
          </Link>
        ))}
      </div>
      <article
        className="prose prose-slate max-w-3xl rounded-lg border bg-card p-8 shadow-sm prose-headings:tracking-tight dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
