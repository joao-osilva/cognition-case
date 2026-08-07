import {
  CheckIcon,
  ClockIcon,
  CloudIcon,
  CrosshairIcon,
  HammerIcon,
  HourglassIcon,
  ShieldIcon,
  WrenchIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

const DIMENSION_ICONS = {
  build: HammerIcon,
  maintenance: WrenchIcon,
  security: ShieldIcon,
  opportunity: HourglassIcon,
} as const;

const EFFORT_STYLES: Record<string, string> = {
  days: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  ongoing: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  months: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
  notBridgeable: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
};

export async function EvaluationView() {
  const t = await getTranslations("evaluationPage");

  const contextItems = [
    { icon: ClockIcon, key: "time" },
    { icon: CrosshairIcon, key: "scope" },
    { icon: CloudIcon, key: "deploy" },
  ] as const;

  return (
    <div className="max-w-4xl space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">
          {t("context.title")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {contextItems.map(({ icon: Icon, key }) => (
            <Card key={key} className="gap-2 py-4">
              <CardContent className="flex items-start gap-3 px-4">
                <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <div>
                  <div className="text-sm font-medium">
                    {t(`context.${key}.label`)}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {t(`context.${key}.detail`)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">
          {t("replicated.title")}
        </h2>
        <Card className="py-4">
          <CardContent className="px-4">
            <ul className="grid gap-2 sm:grid-cols-2">
              {REPLICATED.map((key) => (
                <li key={key} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
                    <CheckIcon aria-hidden="true" className="size-3" />
                  </span>
                  {t(`replicated.items.${key}`)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="mb-1 text-lg font-semibold tracking-tight">
          {t("gaps.title")}
        </h2>
        <p className="mb-3 text-sm text-muted-foreground">{t("gaps.intro")}</p>
        <div className="overflow-hidden rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("gaps.columns.gap")}</TableHead>
                <TableHead>{t("gaps.columns.takes")}</TableHead>
                <TableHead>{t("gaps.columns.effort")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {GAPS.map((key) => {
                const effort = t(`gaps.items.${key}.effort`);
                return (
                  <TableRow key={key}>
                    <TableCell className="font-medium">
                      {t(`gaps.items.${key}.name`)}
                    </TableCell>
                    <TableCell className="whitespace-normal text-muted-foreground">
                      {t(`gaps.items.${key}.takes`)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn("border-0", EFFORT_STYLES[effort])}
                      >
                        {t(`gaps.effort.${effort}`)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold tracking-tight">
          {t("dimensions.title")}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {DIMENSIONS.map((key) => {
            const Icon = DIMENSION_ICONS[key];
            return (
              <Card key={key} className="gap-2 py-4">
                <CardHeader className="px-4">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      <Icon aria-hidden="true" className="size-4" />
                    </span>
                    {t(`dimensions.items.${key}.title`)}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 text-sm text-muted-foreground">
                  {t(`dimensions.items.${key}.body`)}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-lg font-semibold tracking-tight">
          {t("capexOpex.title")}
        </h2>
        <p className="mb-3 text-sm text-muted-foreground">
          {t("capexOpex.intro")}
        </p>
        <div className="overflow-hidden rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("capexOpex.columns.dimension")}</TableHead>
                <TableHead>{t("capexOpex.columns.capex")}</TableHead>
                <TableHead>{t("capexOpex.columns.opex")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DIMENSIONS.map((key) => {
                const capex = t(`capexOpex.items.${key}.capex`);
                return (
                  <TableRow key={key}>
                    <TableCell className="font-medium">
                      {t(`dimensions.items.${key}.title`)}
                    </TableCell>
                    <TableCell className="whitespace-normal text-muted-foreground">
                      {capex === "-" ? (
                        <span aria-label={t("capexOpex.none")}>-</span>
                      ) : (
                        capex
                      )}
                    </TableCell>
                    <TableCell className="whitespace-normal text-muted-foreground">
                      {t(`capexOpex.items.${key}.opex`)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm">
          {t("capexOpex.buyProfile")}
        </div>
      </section>
    </div>
  );
}
