"use client";

import { useCallback, useEffect, useState } from "react";
import { useRole } from "@/components/RoleContext";
import { ErrorBanner, PageHeader, StatusBadge } from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Refund } from "@/lib/types";

export default function RefundsPage() {
  const { role } = useRole();
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/refunds");
    const data = await res.json();
    setRefunds(data.refunds);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function act(id: string, action: string) {
    setError("");
    const res = await fetch(`/api/refunds/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      return;
    }
    await load();
  }

  const canApprove = role === "approver" || role === "admin";
  const canProcess = role === "admin";

  const visible = refunds.filter(
    (r) => statusFilter === "all" || r.status === statusFilter
  );

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
        subtitle="Approve or reject refund requests, then process approved payouts. Refunds over 1,000 and payout processing require admin."
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
              <CardTitle className="text-2xl">{card.value}</CardTitle>
              <CardDescription>{card.label}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="mb-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" aria-label="Status filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="requested">Requested</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Refund</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Order</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.id}</TableCell>
                <TableCell className="font-medium">{r.customerName}</TableCell>
                <TableCell className="font-mono text-xs">{r.orderId}</TableCell>
                <TableCell>
                  {r.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{" "}
                  <span className="text-xs text-muted-foreground">
                    {r.currency}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {r.reason}
                </TableCell>
                <TableCell>
                  <StatusBadge value={r.status} />
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(r.requestedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {r.status === "requested" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => act(r.id, "approve")}
                          disabled={!canApprove}
                          title={
                            canApprove ? undefined : "Requires approver role"
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => act(r.id, "reject")}
                          disabled={!canApprove}
                          title={
                            canApprove ? undefined : "Requires approver role"
                          }
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {r.status === "approved" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => act(r.id, "process")}
                        disabled={!canProcess}
                        title={canProcess ? undefined : "Requires admin role"}
                      >
                        Process payout
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {visible.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-muted-foreground"
                >
                  No refunds match the current filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
