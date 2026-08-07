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
import { useQueryState } from "@/lib/use-query-state";
import { AuditEntry, KycCase } from "@/lib/types";

function KycCasePageContent() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { role } = useRole();
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
      setError(data.error ?? "Something went wrong.");
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
            Back
          </CommandButton>
        </CommandBar>
        <div className="rounded-b-lg border bg-card p-8 text-center text-muted-foreground">
          Case {id} was not found. It may have been removed when the in-memory
          store reseeded.
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
          Back
        </CommandButton>
        <CommandButton icon={RefreshCwIcon} onClick={load}>
          Refresh
        </CommandButton>
        {canDecide && (
          <>
            {kycCase.status === "pending" && (
              <CommandButton icon={PlayIcon} onClick={() => act("start_review")}>
                Start Review
              </CommandButton>
            )}
            <CommandButton icon={CheckIcon} onClick={() => act("approve")}>
              Approve
            </CommandButton>
            <CommandButton
              icon={XIcon}
              onClick={() => act("reject")}
              className="text-destructive hover:text-destructive"
            >
              Reject
            </CommandButton>
            <CommandButton
              icon={ArrowUpRightIcon}
              onClick={() => act("escalate")}
            >
              Escalate
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
              {kycCase.id} · KYC Case
            </p>
          </div>
          <dl className="flex gap-6 text-sm">
            <div>
              <dt className="text-xs text-muted-foreground">Risk</dt>
              <dd className="mt-0.5">
                <StatusBadge value={kycCase.riskLevel} />
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Country</dt>
              <dd className="mt-0.5">{kycCase.country}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted-foreground">Submitted</dt>
              <dd className="mt-0.5 tabular-nums">
                {new Intl.DateTimeFormat(undefined, {
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
              Summary
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="rounded-none border-0 border-b-2 border-transparent px-3 py-2.5 data-[state=active]:border-primary data-[state=active]:shadow-none"
            >
              Audit History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="px-6 py-5">
            {error && (
              <ErrorBanner message={error} onDismiss={() => setError("")} />
            )}
            <div className="grid gap-6 lg:grid-cols-2">
              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Customer Information
                </h2>
                <dl className="grid gap-3 text-sm">
                  {[
                    ["Full name", kycCase.customerName],
                    ["Email", kycCase.customerEmail],
                    ["Country", kycCase.country],
                    ["Document type", kycCase.documentType],
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
                      Case Notes
                    </h2>
                    <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                      {kycCase.notes}
                    </p>
                  </div>
                )}
              </section>

              <section>
                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Decision
                </h2>
                {canDecide ? (
                  <div className="flex flex-col gap-2">
                    <Textarea
                      aria-label="Decision note"
                      placeholder="Decision note (required for reject / escalate)…"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use the command bar above to approve, reject, or escalate
                      this case.
                    </p>
                  </div>
                ) : (
                  <Alert>
                    <AlertDescription>
                      You are a <strong>viewer</strong> — switch to approver or
                      admin to make decisions.
                    </AlertDescription>
                  </Alert>
                )}
              </section>
            </div>
          </TabsContent>

          <TabsContent value="history" className="px-6 py-5">
            {history.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No audit entries for this case yet.
              </p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>When</TableHead>
                      <TableHead>Actor</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Before</TableHead>
                      <TableHead>After</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell className="text-xs tabular-nums text-muted-foreground">
                          {new Intl.DateTimeFormat(undefined, {
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
