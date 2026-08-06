import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { cn } from "@/lib/utils";

const DOCS: Record<string, { file: string; title: string }> = {
  research: { file: "research.md", title: "Research" },
  evaluation: { file: "evaluation.md", title: "Evaluation" },
  recommendation: { file: "recommendation.md", title: "Recommendation" },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((slug) => ({ slug }));
}

export default async function AnalysisPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = DOCS[slug];
  if (!doc) notFound();

  const filePath = path.join(process.cwd(), "docs", doc.file);
  let markdown: string;
  try {
    markdown = await fs.readFile(filePath, "utf-8");
  } catch {
    notFound();
  }

  const html = await marked.parse(markdown);

  return (
    <div>
      <div className="mb-6 flex gap-2 text-sm">
        {Object.entries(DOCS).map(([key, value]) => (
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
            {value.title}
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
