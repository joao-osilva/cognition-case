"use client";

import { useCallback, useEffect, useState } from "react";
import { useRole } from "@/components/RoleContext";
import { ErrorBanner, PageHeader, StatusBadge } from "@/components/ui";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

      <div className="mb-4 flex items-center gap-4">
        {!isAdmin && (
          <Alert variant="warning" className="flex-1">
            <AlertDescription>
              You are <strong>{role}</strong> — flag changes require admin.
            </AlertDescription>
          </Alert>
        )}
        <Button
          onClick={() => setShowForm((v) => !v)}
          disabled={!isAdmin}
          className="ml-auto"
          title={isAdmin ? undefined : "Requires admin role"}
        >
          {showForm ? "Cancel" : "New flag"}
        </Button>
      </div>

      {showForm && isAdmin && (
        <Card className="mb-6">
          <CardContent>
            <form onSubmit={createFlag} className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 text-sm">
                <label htmlFor="flag-key" className="text-muted-foreground">
                  Key (kebab-case)
                </label>
                <Input
                  id="flag-key"
                  value={form.key}
                  onChange={(e) => setForm({ ...form, key: e.target.value })}
                  placeholder="new-payment-flow"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 text-sm">
                <label htmlFor="flag-owner" className="text-muted-foreground">
                  Owner
                </label>
                <Input
                  id="flag-owner"
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                  placeholder="payments-team"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                <label htmlFor="flag-desc" className="text-muted-foreground">
                  Description
                </label>
                <Input
                  id="flag-desc"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="What does this flag control?"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 text-sm">
                <label className="text-muted-foreground">Environment</label>
                <Select
                  value={form.environment}
                  onValueChange={(v) => setForm({ ...form, environment: v })}
                >
                  <SelectTrigger aria-label="Environment">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="development">development</SelectItem>
                      <SelectItem value="staging">staging</SelectItem>
                      <SelectItem value="production">production</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button type="submit">Create flag</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Flag</TableHead>
              <TableHead>Environment</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Rollout</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Enabled</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flags.map((f) => (
              <TableRow key={f.id}>
                <TableCell>
                  <div className="font-mono text-xs font-medium">{f.key}</div>
                  <div className="text-xs text-muted-foreground">
                    {f.description}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge value={f.environment} />
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {f.owner}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Slider
                      min={0}
                      max={100}
                      step={5}
                      defaultValue={[f.rolloutPercent]}
                      disabled={!isAdmin}
                      onValueCommit={([value]) =>
                        patch(f.id, { rolloutPercent: value })
                      }
                      className="w-28"
                      aria-label={`Rollout percentage for ${f.key}`}
                    />
                    <span className="w-10 text-xs text-muted-foreground">
                      {f.rolloutPercent}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(f.updatedAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={f.enabled}
                    onCheckedChange={(checked) =>
                      patch(f.id, { enabled: checked })
                    }
                    disabled={!isAdmin}
                    aria-label={`Toggle ${f.key}`}
                    title={isAdmin ? undefined : "Requires admin role"}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
