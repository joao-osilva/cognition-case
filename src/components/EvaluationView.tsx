import { CheckIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const GAPS = ["sso", "database", "connectors", "citizen", "compliance"] as const;
const DIMENSIONS = ["build", "maintenance", "security", "opportunity"] as const;
const REPLICATED = ["grids", "forms", "rbac", "audit", "deploy"] as const;
const DIMENSION_POINTS: Record<(typeof DIMENSIONS)[number], number> = {
  build: 3,
  maintenance: 2,
  security: 2,
  opportunity: 2,
};

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
        <h1 className="text-2xl font-semibold tracking-tight text-pretty">
          {t("title")}
        </h1>
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
            <h3 className="mb-4 text-sm font-medium">{t("replicated.title")}</h3>
            <ul className="space-y-4">
              {REPLICATED.map((key) => (
                <li key={key} className="text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-medium">
                      {t(`replicated.items.${key}.name`)}
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckIcon
                        aria-hidden="true"
                        className="size-3 text-emerald-600 dark:text-emerald-400"
                      />
                      {t("replicated.done")}
                    </span>
                  </div>
                  <p className="mt-0.5 leading-snug text-muted-foreground">
                    {t(`replicated.items.${key}.detail`)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:border-l sm:pl-8">
            <h3 className="mb-4 text-sm font-medium">{t("gaps.title")}</h3>
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
            <div key={key} className="grid gap-2 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <dt className="text-sm font-medium">{t(`dimensions.items.${key}.title`)}</dt>
              <dd>
                <ul className="space-y-2">
                  {Array.from({ length: DIMENSION_POINTS[key] }, (_, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1 shrink-0 rounded-full bg-border"
                      />
                      {t(`dimensions.items.${key}.points.${i}`)}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <Eyebrow index="03">{t("capexOpex.title")}</Eyebrow>
        <p className="mb-4 text-sm text-muted-foreground">{t("capexOpex.intro")}</p>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[10rem]">
                  {t("capexOpex.columns.dimension")}
                </TableHead>
                <TableHead>{t("capexOpex.columns.capex")}</TableHead>
                <TableHead>{t("capexOpex.columns.opex")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DIMENSIONS.map((key) => {
                const capex = t(`capexOpex.items.${key}.capex`);
                return (
                  <TableRow key={key}>
                    <TableCell className="align-top font-medium">
                      {t(`dimensions.items.${key}.title`)}
                    </TableCell>
                    <TableCell className="whitespace-normal align-top text-muted-foreground">
                      {capex === "-" ? (
                        <span aria-label={t("capexOpex.none")}>&mdash;</span>
                      ) : (
                        capex
                      )}
                    </TableCell>
                    <TableCell className="whitespace-normal align-top text-muted-foreground">
                      {t(`capexOpex.items.${key}.opex`)}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow className="border-t-2 bg-muted/30">
                <TableCell className="align-top font-medium">
                  {t("capexOpex.buyTitle")}
                </TableCell>
                <TableCell className="whitespace-normal align-top text-muted-foreground">
                  {t("capexOpex.buyCapex")}
                </TableCell>
                <TableCell className="whitespace-normal align-top text-muted-foreground">
                  {t("capexOpex.buyOpex")}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">{t("capexOpex.buyProfile")}</p>
      </section>
    </div>
  );
}
