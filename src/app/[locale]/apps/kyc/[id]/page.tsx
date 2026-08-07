"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  CheckIcon,
  PlayIcon,
  RefreshCwIcon,
  XIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRole } from "@/components/RoleContext";
import { ErrorBanner, StatusBadge } from "@/components/ui";
import { CommandBar, CommandButton } from "@/components/grid";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useApiErrorMessage } from "@/lib/api-error";
import { useQueryState } from "@/lib/use-query-state";
import { AuditEntry, KycCase } from "@/lib/types";

function KycCasePageContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { role } = useRole();
  const t = useTranslations("kycCase");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const apiError = useApiErrorMessage();
  const [kycCase, setKycCase] = useState<KycCase | null>(null);
  const [history, setHistory] = useState<AuditEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useQueryState("tab", "summary");

  const load = useCallback(async () => {
    const [kycRes, auditRes] = await Promise.all([
      fetch("/api/kyc"),
      fetch("/api/audit"),
    ]);
    const kycData = await kycRes.json();
    const auditData = await auditRes.json();
    setKycCase(
      (kycData.cases as KycCase[]).find((c) => c.id === id) ?? null
    );
    setHistory(
      (auditData.audit as AuditEntry[]).filter((e) => e.entityId === id)
    );
    setLoaded(true);
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(action: string) {
    setError("");
    const res = await fetch(`/api/kyc/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, notes }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(apiError(data));
      return;
    }
    setNotes("");
    await load();
  }

  const canDecide = role === "approver" || role === "admin";

  if (loaded && !kycCase) {
    return (
      <div>
        <CommandBar>
          <CommandButton
            icon={ArrowLeftIcon}
            onClick={() => router.push("/apps/kyc")}
          >
            {tCommon("back")}
          </CommandButton>
        </CommandBar>
        <div className="rounded-b-lg border bg-card p-8 text-center text-muted-foreground">
          {t("notFound", { id })}
        </div>
      </div>
    );
  }

  if (!kycCase) return null;

  return (
    <div>
      <CommandBar>
        <CommandButton
          icon={ArrowLeftIcon}
          onClick={() => router.push("/apps/kyc")}
        >
          {tCommon("back")}
        </CommandButton>
        <CommandButton icon={RefreshCwIcon} onClick={load}>
          {tCommon("refresh")}
        </CommandButton>
        {canDecide && (
          <>
            {kycCase.status === "pending" && (
              <CommandButton icon={PlayIcon} onClick={() => act("start_review")}>
                {t("startReview")}
              </CommandButton>
            )}
            <CommandButton icon={CheckIcon} onClick={() => act("approve")}>
              {tCommon("approve")}
            </CommandButton>
            <CommandButton
              icon={XIcon}
              onClick={() => act("reject")}
              className="text-destructive hover:text-destructive"
            >
              {tCommon("reject")}
            </CommandButton>
            <CommandButton
              icon={ArrowUpRightIcon}
              onClick={() => act("escalate")}
            >
              {t("escalate")}
            </CommandButton>
          </>
        )}
      </CommandBar>

      <div className="rounded-b-lg border bg-card">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b px-6 py-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold tracking-tight">
                {kycCase.customerName}
              </h1>
              <StatusBadge value={kycCase.status} />
            </div>
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              {kycCase.id} · {t("caseType")}
            </p>
          </div>
          <dl className="flex gap-6 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">{t("risk")}</dt>
              <dd className="mt-0.5">
                <StatusBadge value={kycCase.riskLevel} />
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">
                {t("country")}
              </dt>
              <dd className="mt-0.5">{kycCase.country}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">
                {t("submitted")}
              </dt>
              <dd className="mt-0.5 tabular-nums">
                {new Intl.DateTimeFormat(locale, {
                  dateStyle: "medium",
                }).format(new Date(kycCase.submittedAt))}
              </dd>
            </div>
          </dl>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="gap-0">
          <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0 px-6">
            <TabsTrigger
              value="summary"
              className="rounded-none border-0 border-b-2 border-transparent px-3 py-2.5 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              {t("tabSummary")}
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-none border-0 border-b-2 border-transparent px-3 py-2.5 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              {t("tabHistory")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="px-6 py-5">
            {error && (
              <ErrorBanner message={error} onDismiss={() => setError("")} />
            )}
            <div className="grid gap-6 lg:grid-cols-2">
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("customerInformation")}
                </h2>
                <dl className="grid gap-3 text-sm">
                  {[
                    [t("fullName"), kycCase.customerName],
                    [t("email"), kycCase.customerEmail],
                    [t("country"), kycCase.country],
                    [t("documentType"), kycCase.documentType],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="grid grid-cols-[10rem_1fr] items-center gap-2"
                    >
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="rounded-sm bg-muted px-2.5 py-1.5">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
                {kycCase.notes && (
                  <div className="mt-4">
                    <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {t("caseNotes")}
                    </h2>
                    <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                      {kycCase.notes}
                    </p>
                  </div>
                )}
              </section>

              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {t("decision")}
                </h2>
                {canDecide ? (
                  <div className="flex flex-col gap-2">
                    <Textarea
                      aria-label={t("decisionNoteLabel")}
                      placeholder={t("decisionNotePlaceholder")}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      {t("decisionHint")}
                    </p>
                  </div>
                ) : (
                  <Alert>
                    <AlertDescription>
                      {t.rich("viewerNotice", {
                        strong: (chunks) => <strong>{chunks}</strong>,
                      })}
                    </AlertDescription>
                  </Alert>
                )}
              </section>
            </div>
          </TabsContent>

          <TabsContent value="history" className="px-6 py-5">
            {history.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {t("noHistory")}
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("columns.when")}</TableHead>
                      <TableHead>{t("columns.actor")}</TableHead>
                      <TableHead>{t("columns.role")}</TableHead>
                      <TableHead>{t("columns.action")}</TableHead>
                      <TableHead>{t("columns.before")}</TableHead>
                      <TableHead>{t("columns.after")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((e) => (
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
                        <TableCell className="font-medium">
                          {e.action}
                        </TableCell>
                        <TableCell className="max-w-40 truncate font-mono text-xs text-muted-foreground">
                          {e.before ?? "—"}
                        </TableCell>
                        <TableCell className="max-w-40 truncate font-mono text-xs">
                          {e.after ?? "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function KycCasePage() {
  return (
    <Suspense>
      <KycCasePageContent />
    </Suspense>
  );
}
