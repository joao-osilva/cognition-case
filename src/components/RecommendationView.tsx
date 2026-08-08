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

const OPTIONS = ["renegotiate", "vendor", "build"] as const;
const CRITERIA = ["cost", "effort", "risk", "customization"] as const;
const REASONS = ["commodity", "tco", "hybrid", "citizen", "devin"] as const;
const TRIGGERS = ["audit", "demand", "customization", "compliance"] as const;
const STEPS = ["audit", "quotes", "checkpoint", "pilot"] as const;

const RATINGS: Record<
  (typeof OPTIONS)[number],
  Record<(typeof CRITERIA)[number], "good" | "fair" | "poor">
> = {
  renegotiate: { cost: "good", effort: "good", risk: "good", customization: "poor" },
  vendor: { cost: "good", effort: "fair", risk: "fair", customization: "fair" },
  build: { cost: "fair", effort: "poor", risk: "fair", customization: "good" },
};

const RATING_DOT: Record<"good" | "fair" | "poor", string> = {
  good: "bg-emerald-500",
  fair: "bg-amber-500",
  poor: "bg-rose-500",
};

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

export async function RecommendationView() {
  const t = await getTranslations("recommendationPage");

  return (
    <div className="max-w-5xl">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-pretty">
          {t("title")}
        </h1>
        <div className="mt-4 max-w-3xl rounded-md border-l-2 border-primary bg-primary/5 p-4 dark:bg-primary/10">
          <p className="text-[15px] font-medium leading-relaxed text-foreground">
            {t("bluf")}
          </p>
        </div>
      </header>

      <section className="mb-12">
        <Eyebrow index="01">{t("situation.title")}</Eyebrow>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("situation.body")}
        </p>
      </section>

      <section className="mb-12">
        <Eyebrow index="02">{t("options.title")}</Eyebrow>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[14rem]">
                  {t("options.columns.option")}
                </TableHead>
                {CRITERIA.map((key) => (
                  <TableHead key={key}>{t(`options.columns.${key}`)}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {OPTIONS.map((option) => (
                <TableRow key={option}>
                  <TableCell className="whitespace-normal align-top font-medium">
                    {t(`options.items.${option}.name`)}
                  </TableCell>
                  {CRITERIA.map((criterion) => (
                    <TableCell
                      key={criterion}
                      className="whitespace-normal align-top text-muted-foreground"
                    >
                      <span className="flex items-start gap-2">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "mt-1.5 size-1.5 shrink-0 rounded-full",
                            RATING_DOT[RATINGS[option][criterion]]
                          )}
                        />
                        <span>
                          <span className="sr-only">
                            {t(`options.ratings.${RATINGS[option][criterion]}`)}:{" "}
                          </span>
                          {t(`options.items.${option}.${criterion}`)}
                        </span>
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
          {(["good", "fair", "poor"] as const).map((rating) => (
            <span key={rating} className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className={cn("size-1.5 rounded-full", RATING_DOT[rating])}
              />
              {t(`options.ratings.${rating}`)}
            </span>
          ))}
        </p>
      </section>

      <section className="mb-12">
        <Eyebrow index="03">{t("reasoning.title")}</Eyebrow>
        <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {REASONS.map((key) => (
            <li key={key} className="text-sm">
              <span className="font-medium">{t(`reasoning.items.${key}.name`)}</span>
              <p className="mt-0.5 leading-snug text-muted-foreground">
                {t(`reasoning.items.${key}.detail`)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <Eyebrow index="04">{t("triggers.title")}</Eyebrow>
        <p className="mb-4 max-w-2xl text-sm text-muted-foreground">
          {t("triggers.intro")}
        </p>
        <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {TRIGGERS.map((key) => (
            <li key={key} className="text-sm">
              <span className="flex items-center gap-2 font-medium">
                <span
                  aria-hidden="true"
                  className="size-1.5 rounded-full bg-amber-500"
                />
                {t(`triggers.items.${key}.name`)}
              </span>
              <p className="mt-0.5 leading-snug text-muted-foreground">
                {t(`triggers.items.${key}.detail`)}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <Eyebrow index="05">{t("steps.title")}</Eyebrow>
        <ol className="space-y-4">
          {STEPS.map((key, i) => (
            <li key={key} className="flex gap-4 text-sm">
              <span
                aria-hidden="true"
                className="font-mono text-xs font-semibold tabular-nums leading-6 text-primary"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>
                <span className="font-medium">{t(`steps.items.${key}.name`)}</span>
                <p className="mt-0.5 leading-snug text-muted-foreground">
                  {t(`steps.items.${key}.detail`)}
                </p>
              </span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
