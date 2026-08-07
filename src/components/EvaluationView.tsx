import { CheckIcon, RefreshCwIcon, SquareIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";

const GAPS = ["sso", "database", "connectors", "citizen", "compliance"] as const;
const DIMENSIONS = ["build", "maintenance", "security", "opportunity"] as const;
const REPLICATED = ["grids", "forms", "rbac", "audit", "deploy"] as const;

const EFFORT_DOT: Record<string, string> = {
  days: "bg-emerald-500",
  ongoing: "bg-amber-500",
  months: "bg-orange-500",
  notBridgeable: "bg-rose-500",
};

function Eyebrow({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-baseline gap-3 border-b pb-2">
      <span className="font-mono text-xs tabular-nums text-muted-foreground/70">
        {index}
      </span>
      <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {children}
      </h2>
    </div>
  );
}

export async function EvaluationView() {
  const t = await getTranslations("evaluationPage");

  return (
    <div className="max-w-3xl">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
          {t("lead")}
        </p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
          {(["time", "scope", "deploy"] as const).map((key) => (
            <span key={key} className="text-foreground/80">
              {t(`facts.${key}`)}
            </span>
          ))}
        </div>
      </header>

      <section className="mb-12">
        <Eyebrow index="01">{t("comparison.title")}</Eyebrow>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 text-sm font-medium">{t("replicated.title")}</h3>
            <ul className="space-y-2.5">
              {REPLICATED.map((key) => (
                <li key={key} className="flex items-start gap-2.5 text-sm leading-snug">
                  <CheckIcon
                    aria-hidden="true"
                    className="mt-0.5 size-3.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                  />
                  {t(`replicated.items.${key}`)}
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:border-l sm:pl-8">
            <h3 className="mb-3 text-sm font-medium">{t("gaps.title")}</h3>
            <ul className="space-y-4">
              {GAPS.map((key) => {
                const effort = t(`gaps.items.${key}.effort`);
                return (
                  <li key={key} className="text-sm">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="font-medium">{t(`gaps.items.${key}.name`)}</span>
                      <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                        <span
                          aria-hidden="true"
                          className={cn("size-1.5 rounded-full", EFFORT_DOT[effort])}
                        />
                        {t(`gaps.effort.${effort}`)}
                      </span>
                    </div>
                    <p className="mt-0.5 leading-snug text-muted-foreground">
                      {t(`gaps.items.${key}.takes`)}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <Eyebrow index="02">{t("dimensions.title")}</Eyebrow>
        <dl className="divide-y">
          {DIMENSIONS.map((key) => (
            <div key={key} className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <dt className="text-sm font-medium">{t(`dimensions.items.${key}.title`)}</dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">
                {t(`dimensions.items.${key}.body`)}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <Eyebrow index="03">{t("capexOpex.title")}</Eyebrow>
        <p className="mb-5 text-sm text-muted-foreground">{t("capexOpex.intro")}</p>
        <div className="grid gap-4 sm:grid-cols-[3fr_2fr]">
          <div className="rounded-md border">
            <div className="flex items-center justify-between border-b bg-muted/50 px-4 py-2.5">
              <h3 className="text-sm font-semibold">{t("capexOpex.buildTitle")}</h3>
              <div className="flex gap-4 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <SquareIcon aria-hidden="true" className="size-2.5 fill-current" />
                  {t("capexOpex.legend.oneTime")}
                </span>
                <span className="flex items-center gap-1">
                  <RefreshCwIcon aria-hidden="true" className="size-2.5" />
                  {t("capexOpex.legend.recurring")}
                </span>
              </div>
            </div>
            <div className="divide-y">
              {DIMENSIONS.map((key) => {
                const capex = t(`capexOpex.items.${key}.capex`);
                return (
                  <div key={key} className="px-4 py-3">
                    <div className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                      {t(`dimensions.items.${key}.title`)}
                    </div>
                    <ul className="space-y-1.5 text-sm leading-snug">
                      {capex !== "-" && (
                        <li className="flex items-start gap-2">
                          <SquareIcon
                            aria-label={t("capexOpex.legend.oneTime")}
                            className="mt-1.5 size-2 shrink-0 fill-current text-foreground/60"
                          />
                          {capex}
                        </li>
                      )}
                      <li className="flex items-start gap-2">
                        <RefreshCwIcon
                          aria-label={t("capexOpex.legend.recurring")}
                          className="mt-1 size-3 shrink-0 text-foreground/60"
                        />
                        {t(`capexOpex.items.${key}.opex`)}
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col rounded-md border">
            <div className="border-b bg-muted/50 px-4 py-2.5">
              <h3 className="text-sm font-semibold">{t("capexOpex.buyTitle")}</h3>
            </div>
            <div className="px-4 py-3">
              <ul className="text-sm leading-snug">
                <li className="flex items-start gap-2">
                  <RefreshCwIcon
                    aria-label={t("capexOpex.legend.recurring")}
                    className="mt-1 size-3 shrink-0 text-foreground/60"
                  />
                  {t("capexOpex.license")}
                </li>
              </ul>
            </div>
            <p className="mt-auto border-t px-4 py-3 text-sm leading-snug text-muted-foreground">
              {t("capexOpex.buyProfile")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
