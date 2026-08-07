"use client";

import { useCallback, useEffect, useState } from "react";
import { FlagIcon, PlusIcon, RefreshCwIcon, XIcon } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRole } from "@/components/RoleContext";
import { CommandBar, CommandButton, GridFooter } from "@/components/grid";
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
import { useApiErrorMessage } from "@/lib/api-error";
import { FeatureFlag } from "@/lib/types";

export default function FlagsPage() {
  const { role } = useRole();
  const t = useTranslations("flags");
  const tCommon = useTranslations("common");
  const tRoles = useTranslations("roles");
  const locale = useLocale();
  const apiError = useApiErrorMessage();
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
      setError(apiError(data));
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
      setError(apiError(data));
      return;
    }
    setForm({ key: "", description: "", environment: "development", owner: "" });
    setShowForm(false);
    await load();
  }

  return (
    <div>
      <PageHeader
        title={t("title")}
        subtitle={t("subtitle")}
        icon={FlagIcon}
      />
      {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

      {!isAdmin && (
        <Alert variant="warning" className="mb-4">
          <AlertDescription>
            {t.rich("roleNotice", {
              role: tRoles(role),
              strong: (chunks) => <strong>{chunks}</strong>,
            })}
          </AlertDescription>
        </Alert>
      )}

      <CommandBar className="mb-0">
        <CommandButton
          icon={showForm ? XIcon : PlusIcon}
          onClick={() => setShowForm((v) => !v)}
          disabled={!isAdmin}
          title={isAdmin ? undefined : t("requiresAdmin")}
        >
          {showForm ? tCommon("cancel") : t("new")}
        </CommandButton>
        <CommandButton icon={RefreshCwIcon} onClick={load}>
          {tCommon("refresh")}
        </CommandButton>
      </CommandBar>

      {showForm && isAdmin && (
        <Card className="rounded-none border-b-0">
          <CardContent>
            <form onSubmit={createFlag} className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5 text-sm">
                <label htmlFor="flag-key" className="text-muted-foreground">
                  {t("keyLabel")}
                </label>
                <Input
                  id="flag-key"
                  value={form.key}
                  onChange={(e) => setForm({ ...form, key: e.target.value })}
                  placeholder={t("keyPlaceholder")}
                  spellCheck={false}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 text-sm">
                <label htmlFor="flag-owner" className="text-muted-foreground">
                  {t("ownerLabel")}
                </label>
                <Input
                  id="flag-owner"
                  value={form.owner}
                  onChange={(e) => setForm({ ...form, owner: e.target.value })}
                  placeholder={t("ownerPlaceholder")}
                  spellCheck={false}
                  autoComplete="off"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 text-sm sm:col-span-2">
                <label htmlFor="flag-desc" className="text-muted-foreground">
                  {t("descriptionLabel")}
                </label>
                <Input
                  id="flag-desc"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder={t("descriptionPlaceholder")}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 text-sm">
                <label htmlFor="flag-env" className="text-muted-foreground">
                  {t("environmentLabel")}
                </label>
                <Select
                  value={form.environment}
                  onValueChange={(v) => setForm({ ...form, environment: v })}
                >
                  <SelectTrigger id="flag-env" aria-label={t("environmentLabel")}>
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
                <Button type="submit">{t("createFlag")}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("columns.flag")}</TableHead>
              <TableHead>{t("columns.environment")}</TableHead>
              <TableHead>{t("columns.owner")}</TableHead>
              <TableHead>{t("columns.rollout")}</TableHead>
              <TableHead>{t("columns.updated")}</TableHead>
              <TableHead>{t("columns.enabled")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flags.map((f) => (
              <TableRow key={f.id}>
                <TableCell>
                  <div className="font-mono text-xs font-medium">{f.key}</div>
                  <div className="max-w-64 truncate text-xs text-muted-foreground">
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
                      aria-label={t("rolloutFor", { key: f.key })}
                    />
                    <span className="w-10 text-xs tabular-nums text-muted-foreground">
                      {f.rolloutPercent}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-xs tabular-nums text-muted-foreground">
                  {new Intl.DateTimeFormat(locale, {
                    dateStyle: "medium",
                  }).format(new Date(f.updatedAt))}
                </TableCell>
                <TableCell>
                  <Switch
                    checked={f.enabled}
                    onCheckedChange={(checked) =>
                      patch(f.id, { enabled: checked })
                    }
                    disabled={!isAdmin}
                    aria-label={t("toggleFlag", { key: f.key })}
                    title={isAdmin ? undefined : t("requiresAdmin")}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <GridFooter count={flags.length} label={t("footerLabel")} />
    </div>
  );
}
