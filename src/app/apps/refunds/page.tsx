"use client";

import { useCallback, useEffect, useState } from "react";
import { BanknoteIcon, CheckIcon, RefreshCwIcon, XIcon } from "lucide-react";
import { useRole } from "@/components/RoleContext";
import { ErrorBanner, PageHeader, StatusBadge } from "@/components/ui";
import {
  CommandBar,
  CommandButton,
  GridFooter,
  ViewSelector,
} from "@/components/grid";
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
import { Refund } from "@/lib/types";

const VIEWS = [
  { value: "all", label: "All refunds" },
  { value: "requested", label: "Requested refunds" },
  { value: "approved", label: "Approved refunds" },
  { value: "rejected", label: "Rejected refunds" },
  { value: "processed", label: "Processed refunds" },
];

export default function RefundsPage() {
  const { role } = useRole();
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [view, setView] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

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
        setError(data.error ?? "Something went wrong.");
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
      <PageHeader
        title="Refunds Dashboard"
        subtitle="Select requests in the grid, then decide from the command bar. Refunds over 1,000 and payout processing require admin."
      />
      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Awaiting decision", value: totals.requested },
          { label: "Approved, unprocessed", value: totals.approved },
          { label: "Processed", value: totals.processed },
          {
            label: "Open exposure",
            value: totals.exposure.toLocaleString(undefined, {
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
          Refresh
        </CommandButton>
        <CommandButton
          icon={CheckIcon}
          disabled={!canApprove || selectedRequested.length === 0}
          title={canApprove ? undefined : "Requires approver role"}
          onClick={() => actOnSelected("approve", selectedRequested)}
        >
          Approve
        </CommandButton>
        <CommandButton
          icon={XIcon}
          disabled={!canApprove || selectedRequested.length === 0}
          title={canApprove ? undefined : "Requires approver role"}
          onClick={() => actOnSelected("reject", selectedRequested)}
          className="text-destructive hover:text-destructive"
        >
          Reject
        </CommandButton>
        <CommandButton
          icon={BanknoteIcon}
          disabled={!canProcess || selectedApproved.length === 0}
          title={canProcess ? undefined : "Requires admin role"}
          onClick={() => actOnSelected("process", selectedApproved)}
        >
          Process Payout
        </CommandButton>
        {selected.size > 0 && (
          <span className="ml-2 text-xs tabular-nums text-muted-foreground">
            {selected.size} selected
          </span>
        )}
      </CommandBar>

      <div className="border-x bg-card px-2 py-1.5">
        <ViewSelector
          value={view}
          onChange={setView}
          options={VIEWS}
          ariaLabel="View"
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
                  aria-label="Select all refunds"
                />
              </TableHead>
              <TableHead>Refund</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
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
                    aria-label={`Select ${r.id}`}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs">{r.id}</TableCell>
                <TableCell className="font-medium">{r.customerName}</TableCell>
                <TableCell className="font-mono text-xs">{r.orderId}</TableCell>
                <TableCell className="tabular-nums">
                  {new Intl.NumberFormat(undefined, {
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
                  {new Intl.DateTimeFormat(undefined, {
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
                  No refunds match the current view.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <GridFooter count={visible.length} label="refunds" />
    </div>
  );
}
