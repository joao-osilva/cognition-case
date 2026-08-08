import { getTranslations } from "next-intl/server";

const DECISIONS = ["store", "auth", "ux", "docs", "boring"] as const;

function Eyebrow({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-baseline gap-3 border-b pb-2">
      <span className="font-mono text-xs font-semibold tabular-nums text-primary">
        {index}
      </span>
      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {children}
      </h2>
    </div>
  );
}

export async function ArchitectureView() {
  const t = await getTranslations("architecturePage");

  return (
    <div className="max-w-5xl">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-pretty">
          {t("title")}
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          {t("lead")}
        </p>
      </header>

      <section className="mb-12">
        <Eyebrow index="01">{t("shape.title")}</Eyebrow>
        <p className="mb-5 max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {t("shape.body")}
        </p>
        <div className="overflow-x-auto rounded-md border bg-muted/30 p-4">
          <pre className="font-mono text-xs leading-relaxed text-foreground/80">
            {"Browser (React 19, shadcn/ui, Tailwind 4)\n"}
            {"  \u2514\u2500 /[locale]/apps/{kyc,refunds,flags}, /audit, /analysis/[slug]\n"}
            {"       \u2514\u2500 API routes (/api/kyc, /api/refunds, /api/flags, /api/audit, /api/role)\n"}
            {"            \u2514\u2500 " + t("shape.storeLine")}
          </pre>
        </div>
      </section>

      <section className="mb-12">
        <Eyebrow index="02">{t("decisions.title")}</Eyebrow>
        <dl className="divide-y">
          {DECISIONS.map((key) => (
            <div key={key} className="grid gap-2 py-5 sm:grid-cols-[16rem_1fr] sm:gap-8">
              <dt className="text-sm font-medium">{t(`decisions.items.${key}.name`)}</dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">
                {t(`decisions.items.${key}.detail`)}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <Eyebrow index="03">{t("limits.title")}</Eyebrow>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {t("limits.body")}
        </p>
      </section>
    </div>
  );
}
