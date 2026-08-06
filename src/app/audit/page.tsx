"use client";

import { useEffect, useState } from "react";
import { PageHeader, StatusBadge } from "@/components/ui";
import { AuditEntry } from "@/lib/types";

export default function AuditPage() {
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [appFilter, setAppFilter] = useState("all");

  useEffect(() => {
    fetch("/api/audit")
      .then((r) => r.json())
      .then((d) => setEntries(d.audit));
  }, []);

  const visible = entries.filter(
    (e) => appFilter === "all" || e.app === appFilter
  );

  return (
    <div>
      <PageHeader
        title="Audit Log"
        subtitle="Every state-changing action across all three apps: who did it, in what role, and the before/after values. Mirrors Dataverse auditing."
      />

      <div className="mb-4">
        <select
          value={appFilter}
          onChange={(e) => setAppFilter(e.target.value)}
          className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm"
        >
          <option value="all">All apps</option>
          <option value="kyc">KYC</option>
          <option value="refunds">Refunds</option>
          <option value="flags">Feature flags</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Actor</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">App</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Entity</th>
              <th className="px-4 py-3">Before</th>
              <th className="px-4 py-3">After</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((e) => (
              <tr key={e.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-xs text-slate-500">
                  {new Date(e.timestamp).toLocaleString()}
                </td>
                <td className="px-4 py-3 text-xs">{e.actor}</td>
                <td className="px-4 py-3">
                  <StatusBadge value={e.role} />
                </td>
                <td className="px-4 py-3 uppercase text-xs text-slate-600">
                  {e.app}
                </td>
                <td className="px-4 py-3 font-medium">{e.action}</td>
                <td className="px-4 py-3 font-mono text-xs">{e.entityId}</td>
                <td className="px-4 py-3 font-mono text-xs text-slate-500">
                  {e.before ?? "—"}
                </td>
                <td className="px-4 py-3 font-mono text-xs">{e.after ?? "—"}</td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                  No audit entries yet — take an action in one of the apps.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
