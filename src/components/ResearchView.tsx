import { getTranslations } from "next-intl/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const COMPONENTS = [
  "canvas",
  "modelDriven",
  "dataverse",
  "connectors",
  "automate",
  "ai",
] as const;
const CAPABILITIES = [
  "grids",
  "forms",
  "rbac",
  "audit",
  "approvals",
  "connectors",
  "managed",
] as const;
const VALUES = ["speed", "citizen", "governance", "integrations", "infra"] as const;
const WEAKNESSES = ["licensing", "delegation", "ux", "api", "lockin"] as const;
const SOURCES = [
  {
    label: "Microsoft, \u201cWhat is Power Apps?\u201d",
    ref: "learn.microsoft.com/power-apps/powerapps-overview",
  },
  {
    label: "Microsoft, Power Apps components (canvas, model-driven, Dataverse)",
    ref: "learn.microsoft.com/power-apps/maker",
  },
  {
    label: "Microsoft, Power Apps pricing",
    ref: "microsoft.com/power-platform/products/power-apps/pricing",
  },
  { label: "Microsoft, Power Platform Licensing Guide (Aug 2025)", ref: null },
  {
    label: "Microsoft, Dataverse auditing",
    ref: "learn.microsoft.com/power-platform/admin/manage-dataverse-auditing",
  },
  { label: "TechTarget, \u201cTop Microsoft Power Apps limitations\u201d", ref: null },
  {
    label: "Conduct, \u201cPower Apps limitations: when to move off low-code\u201d",
    ref: null,
  },
] as const;

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

export async function ResearchView() {
  const t = await getTranslations("researchPage");

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
        <Eyebrow index="01">{t("components.title")}</Eyebrow>
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[14rem]">
                  {t("components.columns.component")}
                </TableHead>
                <TableHead>{t("components.columns.provides")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COMPONENTS.map((key) => (
                <TableRow key={key}>
                  <TableCell className="align-top font-medium">
                    {t(`components.items.${key}.name`)}
                  </TableCell>
                  <TableCell className="whitespace-normal align-top text-muted-foreground">
                    {t(`components.items.${key}.provides`)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      <section className="mb-12">
        <Eyebrow index="02">{t("capabilities.title")}</Eyebrow>
        <ul className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
          {CAPABILITIES.map((key) => (
            <li key={key} className="text-sm">
              <span className="font-medium">{t(`capabilities.items.${key}.name`)}</span>
              <p className="mt-0.5 leading-snug text-muted-foreground">
                {t(`capabilities.items.${key}.detail`)}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-6 border-l-2 pl-4 text-sm leading-relaxed text-muted-foreground">
          {t("capabilities.note")}
        </p>
      </section>

      <section className="mb-12">
        <Eyebrow index="03">{t("value.title")}</Eyebrow>
        <p className="mb-6 text-sm text-muted-foreground">{t("value.intro")}</p>
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 text-sm font-medium">{t("value.bundleTitle")}</h3>
            <ul className="space-y-4">
              {VALUES.map((key) => (
                <li key={key} className="text-sm">
                  <span className="font-medium">{t(`value.bundle.${key}.name`)}</span>
                  <p className="mt-0.5 leading-snug text-muted-foreground">
                    {t(`value.bundle.${key}.detail`)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="sm:border-l sm:pl-10">
            <h3 className="mb-4 text-sm font-medium">{t("value.weaknessesTitle")}</h3>
            <ul className="space-y-4">
              {WEAKNESSES.map((key) => (
                <li key={key} className="text-sm">
                  <span className="font-medium">
                    {t(`value.weaknesses.${key}.name`)}
                  </span>
                  <p className="mt-0.5 leading-snug text-muted-foreground">
                    {t(`value.weaknesses.${key}.detail`)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <Eyebrow index="04">{t("caution.title")}</Eyebrow>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("caution.body")}
        </p>
      </section>

      <footer>
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          {t("sources.title")}
        </h2>
        <ul className="space-y-1">
          {SOURCES.map((source) => (
            <li key={source.label} className="text-xs text-muted-foreground">
              {source.label}
              {source.ref ? (
                <>
                  {" "}
                  &middot;{" "}
                  <span className="font-mono text-muted-foreground/80" translate="no">
                    {source.ref}
                  </span>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
