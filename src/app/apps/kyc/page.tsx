"use client";

import { useCallback, useEffect, useState } from "react";
import { useRole } from "@/components/RoleContext";
import { ErrorBanner, PageHeader, StatusBadge } from "@/components/ui";
import { KycCase } from "@/lib/types";

export default function KycPage() {
  const { role } = useRole();
  const [cases, setCases] = useState<KycCase[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<KycCase | null>(null);
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/kyc");
    const data = await res.json();
    setCases(data.cases);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function act(id: string, action: string) {
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
    setSelected(null);
    setNotes("");
    await load();
  }

  const canDecide = role === "approver" || role === "admin";

  const visible = cases.filter((c) => {
    const matchesSearch =
      !search ||
      `${c.customerName} ${c.customerEmail} ${c.id} ${c.country}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <PageHeader
        title="KYC Review Queue"
        subtitle="Identity verification cases awaiting compliance review. Decisions require the approver role; rejections and escalations require a note."
      />
      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      <div className="mb-4 flex flex-wrap gap-3">
        <input
          placeholder="Search name, email, ID, country…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="in_review">In review</option>
          <option value="escalated">Escalated</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Case</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Document</th>
              <th className="px-4 py-3">Risk</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs">{c.id}</td>
                <td className="px-4 py-3">
                  <div className="font-medium">{c.customerName}</div>
                  <div className="text-xs text-slate-500">{c.customerEmail}</div>
                </td>
                <td className="px-4 py-3">{c.country}</td>
                <td className="px-4 py-3">{c.documentType}</td>
                <td className="px-4 py-3">
                  <StatusBadge value={c.riskLevel} />
                </td>
                <td className="px-4 py-3">
                  <StatusBadge value={c.status} />
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {new Date(c.submittedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => {
                      setSelected(c);
                      setNotes("");
                      setError("");
                    }}
                    className="rounded-md border border-slate-300 px-3 py-1 text-xs font-medium hover:bg-slate-100"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  No cases match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{selected.customerName}</h2>
                <p className="font-mono text-xs text-slate-500">{selected.id}</p>
              </div>
              <StatusBadge value={selected.status} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div>
                <dt className="text-slate-500">Email</dt>
                <dd>{selected.customerEmail}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Country</dt>
                <dd>{selected.country}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Document</dt>
                <dd>{selected.documentType}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Risk level</dt>
                <dd>
                  <StatusBadge value={selected.riskLevel} />
                </dd>
              </div>
            </dl>
            {selected.notes && (
              <p className="mt-3 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
                {selected.notes}
              </p>
            )}

            {canDecide ? (
              <>
                <textarea
                  placeholder="Decision note (required for reject / escalate)…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                  rows={2}
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {selected.status === "pending" && (
                    <button
                      onClick={() => act(selected.id, "start_review")}
                      className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      Start review
                    </button>
                  )}
                  <button
                    onClick={() => act(selected.id, "approve")}
                    className="rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => act(selected.id, "reject")}
                    className="rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-700"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => act(selected.id, "escalate")}
                    className="rounded-md bg-purple-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-purple-700"
                  >
                    Escalate
                  </button>
                  <button
                    onClick={() => setSelected(null)}
                    className="ml-auto rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-4 flex items-center justify-between rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <span>
                  You are a <strong>viewer</strong> — switch to approver or admin
                  to make decisions.
                </span>
                <button
                  onClick={() => setSelected(null)}
                  className="ml-4 font-medium hover:underline"
                >
                  Close
                </button>
              </div>
            )}
            {error && (
              <p className="mt-3 text-sm text-rose-600">{error}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
