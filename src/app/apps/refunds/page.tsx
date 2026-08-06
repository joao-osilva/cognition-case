"use client";

import { useCallback, useEffect, useState } from "react";
import { useRole } from "@/components/RoleContext";
import { ErrorBanner, PageHeader, StatusBadge } from "@/components/ui";
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
          <div
            key={card.label}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="text-2xl font-semibold">{card.value}</div>
            <div className="text-xs text-slate-500">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="requested">Requested</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="processed">Processed</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Refund</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Requested</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs">{r.id}</td>
                <td className="px-4 py-3 font-medium">{r.customerName}</td>
                <td className="px-4 py-3 font-mono text-xs">{r.orderId}</td>
                <td className="px-4 py-3">
                  {r.amount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{" "}
                  <span className="text-xs text-slate-500">{r.currency}</span>
                </td>
                <td className="px-4 py-3 text-slate-600">{r.reason}</td>
                <td className="px-4 py-3">
                  <StatusBadge value={r.status} />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {new Date(r.requestedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {r.status === "requested" && (
                      <>
                        <button
                          onClick={() => act(r.id, "approve")}
                          disabled={!canApprove}
                          className="rounded-md bg-emerald-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-40"
                          title={
                            canApprove ? undefined : "Requires approver role"
                          }
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => act(r.id, "reject")}
                          disabled={!canApprove}
                          className="rounded-md bg-rose-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
                          title={
                            canApprove ? undefined : "Requires approver role"
                          }
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {r.status === "approved" && (
                      <button
                        onClick={() => act(r.id, "process")}
                        disabled={!canProcess}
                        className="rounded-md bg-slate-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
                        title={canProcess ? undefined : "Requires admin role"}
                      >
                        Process payout
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  No refunds match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
