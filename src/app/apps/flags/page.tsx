"use client";

import { useCallback, useEffect, useState } from "react";
import { useRole } from "@/components/RoleContext";
import { ErrorBanner, PageHeader, StatusBadge } from "@/components/ui";
import { FeatureFlag } from "@/lib/types";

export default function FlagsPage() {
  const { role } = useRole();
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    key: "",
    description: "",
    environment: "development",
    owner: "",
  });

  const load = useCallback(async () => {
    const res = await fetch("/api/flags");
    const data = await res.json();
    setFlags(data.flags);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const isAdmin = role === "admin";

  async function patch(id: string, body: Record<string, unknown>) {
    setError("");
    const res = await fetch(`/api/flags/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      return;
    }
    await load();
  }

  async function createFlag(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/flags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Something went wrong.");
      return;
    }
    setForm({ key: "", description: "", environment: "development", owner: "" });
    setShowForm(false);
    await load();
  }

  return (
    <div>
      <PageHeader
        title="Feature-Flag Admin Panel"
        subtitle="Toggle flags and adjust rollout percentages per environment. All changes require the admin role and are recorded in the audit log."
      />
      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      <div className="mb-4 flex items-center justify-between">
        {!isAdmin && (
          <p className="text-sm text-amber-700">
            You are <strong>{role}</strong> — flag changes require admin.
          </p>
        )}
        <button
          onClick={() => setShowForm((v) => !v)}
          disabled={!isAdmin}
          className="ml-auto rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
          title={isAdmin ? undefined : "Requires admin role"}
        >
          {showForm ? "Cancel" : "New flag"}
        </button>
      </div>

      {showForm && isAdmin && (
        <form
          onSubmit={createFlag}
          className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2"
        >
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">Key (kebab-case)</span>
            <input
              value={form.key}
              onChange={(e) => setForm({ ...form, key: e.target.value })}
              placeholder="new-payment-flow"
              className="w-full rounded-md border border-slate-300 px-3 py-1.5"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">Owner</span>
            <input
              value={form.owner}
              onChange={(e) => setForm({ ...form, owner: e.target.value })}
              placeholder="payments-team"
              className="w-full rounded-md border border-slate-300 px-3 py-1.5"
              required
            />
          </label>
          <label className="text-sm sm:col-span-2">
            <span className="mb-1 block text-slate-500">Description</span>
            <input
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What does this flag control?"
              className="w-full rounded-md border border-slate-300 px-3 py-1.5"
              required
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-slate-500">Environment</span>
            <select
              value={form.environment}
              onChange={(e) => setForm({ ...form, environment: e.target.value })}
              className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5"
            >
              <option value="development">development</option>
              <option value="staging">staging</option>
              <option value="production">production</option>
            </select>
          </label>
          <div className="flex items-end">
            <button
              type="submit"
              className="rounded-md bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Create flag
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Flag</th>
              <th className="px-4 py-3">Environment</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Rollout</th>
              <th className="px-4 py-3">Updated</th>
              <th className="px-4 py-3">Enabled</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {flags.map((f) => (
              <tr key={f.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="font-mono text-xs font-medium">{f.key}</div>
                  <div className="text-xs text-slate-500">{f.description}</div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge value={f.environment} />
                </td>
                <td className="px-4 py-3 text-slate-600">{f.owner}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      defaultValue={f.rolloutPercent}
                      disabled={!isAdmin}
                      onMouseUp={(e) =>
                        patch(f.id, {
                          rolloutPercent: Number(
                            (e.target as HTMLInputElement).value
                          ),
                        })
                      }
                      onTouchEnd={(e) =>
                        patch(f.id, {
                          rolloutPercent: Number(
                            (e.target as HTMLInputElement).value
                          ),
                        })
                      }
                      className="w-28 disabled:cursor-not-allowed disabled:opacity-40"
                      title={isAdmin ? undefined : "Requires admin role"}
                    />
                    <span className="w-10 text-xs text-slate-500">
                      {f.rolloutPercent}%
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">
                  {new Date(f.updatedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => patch(f.id, { enabled: !f.enabled })}
                    disabled={!isAdmin}
                    role="switch"
                    aria-checked={f.enabled}
                    className={`relative h-6 w-11 rounded-full transition disabled:cursor-not-allowed disabled:opacity-40 ${
                      f.enabled ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                    title={isAdmin ? undefined : "Requires admin role"}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                        f.enabled ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
