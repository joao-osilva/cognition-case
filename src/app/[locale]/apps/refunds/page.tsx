"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { BanknoteIcon, CheckIcon, RefreshCwIcon, XIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRole } from "@/components/RoleContext";
import { ErrorBanner, PageHeader, StatusBadge } from "@/components/ui";
import {
  CommandBar,
  CommandButton,
  GridFooter,
  ViewSelector,
} from "@/components/grid";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApiErrorMessage } from "@/lib/api-error";
import { useQueryState } from "@/lib/use-query-state";
import { Refund } from "@/lib/types";

const VIEW_KEYS = [
  "all",
  "requested",
  "approved",
  "rejected",
  "processed",
] as const;

function RefundsPageContent() {
  const { role } = useRole();
  const t = useTranslations("refunds");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const apiError = useApiErrorMessage();
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [view, setView] = useQueryState("view", "all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");
  const [confirmReject, setConfirmReject] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/refunds");
    const data = await res.json();
    setRefunds(data.refunds);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function actOnSelected(action: string, eligible: Refund[]) {
    setError("");
    for (const r of eligible) {
      const res = await fetch(`/api/refunds/${r.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(apiError(data));
        break;
      }
    }
    setSelected(new Set());
    await load();
  }

  const canApprove = role === "approver" || role === "admin";
  const canProcess = role === "admin";

  const visible = refunds.filter(
    (r) => view === "all" || r.status === view
  );

  const selectedRefunds = refunds.filter((r) => selected.has(r.id));
  const selectedRequested = selectedRefunds.filter(
    (r) => r.status === "requested"
  );
  const selectedApproved = selectedRefunds.filter(
    (r) => r.status === "approved"
  );

  const allSelected =
    visible.length > 0 && visible.every((r) => selected.has(r.id));

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(visible.map((r) => r.id)) : new Set());
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  const totals = {
    requested: refunds.filter((r) => r.status === "requested").length,
    approved: refunds.filter((r) => r.status === "approved").length,
    processed: refunds.filter((r) => r.status === "processed").length,
    exposure: refunds
      .filter((r) => r.status === "requested" || r.status === "approved")
      .reduce((sum, r) => sum + r.amount, 0),
  };

  return (
    <div>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: t("awaitingDecision"), value: totals.requested },
          { label: t("approvedUnprocessed"), value: totals.approved },
          { label: t("processed"), value: totals.processed },
          {
            label: t("openExposure"),
            value: totals.exposure.toLocaleString(locale, {
              maximumFractionDigits: 0,
            }),
          },
        ].map((card) => (
          <Card key={card.label}>
            <CardHeader>
              <CardTitle className="text-2xl tabular-nums">
                {card.value}
              </CardTitle>
              <CardDescription>{card.label}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <CommandBar>
        <CommandButton icon={RefreshCwIcon} onClick={load}>
          {tCommon("refresh")}
        </CommandButton>
        <CommandButton
          icon={CheckIcon}
          disabled={!canApprove || selectedRequested.length === 0}
          title={canApprove ? undefined : t("requiresApprover")}
          onClick={() => actOnSelected("approve", selectedRequested)}
        >
          {tCommon("approve")}
        </CommandButton>
        <CommandButton
          icon={XIcon}
          disabled={!canApprove || selectedRequested.length === 0}
          title={canApprove ? undefined : t("requiresApprover")}
          onClick={() => setConfirmReject(true)}
          className="text-destructive hover:text-destructive"
        >
          {tCommon("reject")}
        </CommandButton>
        <CommandButton
          icon={BanknoteIcon}
          disabled={!canProcess || selectedApproved.length === 0}
          title={canProcess ? undefined : t("requiresAdmin")}
          onClick={() => actOnSelected("process", selectedApproved)}
        >
          {t("processPayout")}
        </CommandButton>
        {selected.size > 0 && (
          <span className="ml-2 text-xs tabular-nums text-muted-foreground">
            {tCommon("selectedCount", { count: selected.size })}
          </span>
        )}
      </CommandBar>

      <div className="border-x bg-card px-2 py-1.5">
        <ViewSelector
          value={view}
          onChange={setView}
          options={VIEW_KEYS.map((v) => ({ value: v, label: t(`views.${v}`) }))}
          ariaLabel={tCommon("view")}
        />
      </div>

      <div className="border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={(v) => toggleAll(v === true)}
                  aria-label={t("selectAll")}
                />
              </TableHead>
              <TableHead>{t("columns.refund")}</TableHead>
              <TableHead>{t("columns.customer")}</TableHead>
              <TableHead>{t("columns.order")}</TableHead>
              <TableHead>{t("columns.amount")}</TableHead>
              <TableHead>{t("columns.reason")}</TableHead>
              <TableHead>{t("columns.status")}</TableHead>
              <TableHead>{t("columns.requested")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((r) => (
              <TableRow
                key={r.id}
                data-state={selected.has(r.id) ? "selected" : undefined}
              >
                <TableCell>
                  <Checkbox
                    checked={selected.has(r.id)}
                    onCheckedChange={(v) => toggleOne(r.id, v === true)}
                    aria-label={t("selectOne", { id: r.id })}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs">{r.id}</TableCell>
                <TableCell className="font-medium">{r.customerName}</TableCell>
                <TableCell className="font-mono text-xs">{r.orderId}</TableCell>
                <TableCell className="tabular-nums">
                  {new Intl.NumberFormat(locale, {
                    style: "currency",
                    currency: r.currency,
                  }).format(r.amount)}
                </TableCell>
                <TableCell className="max-w-48 truncate text-muted-foreground">
                  {r.reason}
                </TableCell>
                <TableCell>
                  <StatusBadge value={r.status} />
                </TableCell>
                <TableCell className="text-xs tabular-nums text-muted-foreground">
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: "medium",
                  }).format(new Date(r.requestedAt))}
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

      <AlertDialog open={confirmReject} onOpenChange={setConfirmReject}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("confirmRejectTitle", { count: selectedRequested.length })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("confirmRejectDescription", {
                count: selectedRequested.length,
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => actOnSelected("reject", selectedRequested)}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {t("confirmRejectAction", { count: selectedRequested.length })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function RefundsPage() {
  return (
    <Suspense>
      <RefundsPageContent />
    </Suspense>
  );
}
