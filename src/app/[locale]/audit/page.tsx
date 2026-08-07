"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { RefreshCwIcon, ScrollTextIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader, StatusBadge } from "@/components/ui";
import {
  CommandBar,
  CommandButton,
  GridFooter,
  ViewSelector,
} from "@/components/grid";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryState } from "@/lib/use-query-state";
import { AuditEntry } from "@/lib/types";

function AuditPageContent() {
  const t = useTranslations("audit");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [appFilter, setAppFilter] = useQueryState("view", "all");

  const load = useCallback(() => {
    fetch("/api/audit")
      .then((r) => r.json())
      .then((d) => setEntries(d.audit));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = entries.filter(
    (e) => appFilter === "all" || e.app === appFilter
  );

  return (
    <div>
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={ScrollTextIcon}
      />

      <CommandBar>
        <CommandButton icon={RefreshCwIcon} onClick={load}>
          {tCommon("refresh")}
        </CommandButton>
      </CommandBar>

      <div className="border-x bg-card px-2 py-1.5">
        <ViewSelector
          value={appFilter}
          onChange={setAppFilter}
          options={["all", "kyc", "refunds", "flags"].map((v) => ({
            value: v,
            label: t(`views.${v}`),
          }))}
          ariaLabel={tCommon("view")}
        />
      </div>

      <div className="border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("columns.when")}</TableHead>
              <TableHead>{t("columns.actor")}</TableHead>
              <TableHead>{t("columns.role")}</TableHead>
              <TableHead>{t("columns.app")}</TableHead>
              <TableHead>{t("columns.action")}</TableHead>
              <TableHead>{t("columns.entity")}</TableHead>
              <TableHead>{t("columns.before")}</TableHead>
              <TableHead>{t("columns.after")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="text-xs tabular-nums text-muted-foreground">
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(new Date(e.timestamp))}
                </TableCell>
                <TableCell className="text-xs">{e.actor}</TableCell>
                <TableCell>
                  <StatusBadge value={e.role} />
                </TableCell>
                <TableCell className="text-xs uppercase text-muted-foreground">
                  {e.app}
                </TableCell>
                <TableCell className="font-medium">{e.action}</TableCell>
                <TableCell className="font-mono text-xs">{e.entityId}</TableCell>
                <TableCell className="max-w-40 truncate font-mono text-xs text-muted-foreground">
                  {e.before ?? "—"}
                </TableCell>
                <TableCell className="max-w-40 truncate font-mono text-xs">
                  {e.after ?? "—"}
                </TableCell>
              </TableRow>
            ))}
            {visible.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-muted-foreground"
                >
                  {t("empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <GridFooter count={visible.length} label={t("footerLabel")} />
    </div>
  );
}

export default function AuditPage() {
  return (
    <Suspense>
      <AuditPageContent />
    </Suspense>
  );
}
