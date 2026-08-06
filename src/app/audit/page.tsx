"use client";

import { useEffect, useState } from "react";
import { PageHeader, StatusBadge } from "@/components/ui";
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
        <Select value={appFilter} onValueChange={setAppFilter}>
          <SelectTrigger className="w-40" aria-label="App filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All apps</SelectItem>
              <SelectItem value="kyc">KYC</SelectItem>
              <SelectItem value="refunds">Refunds</SelectItem>
              <SelectItem value="flags">Feature flags</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Actor</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>App</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Before</TableHead>
              <TableHead>After</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((e) => (
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
                <TableCell className="text-xs uppercase text-muted-foreground">
                  {e.app}
                </TableCell>
                <TableCell className="font-medium">{e.action}</TableCell>
                <TableCell className="font-mono text-xs">{e.entityId}</TableCell>
                <TableCell className="max-w-40 truncate font-mono text-xs text-muted-foreground">
                  {e.before ?? "—"}
                </TableCell>
                <TableCell className="max-w-40 truncate font-mono text-xs">
                  {e.after ?? "—"}
                </TableCell>
              </TableRow>
            ))}
            {visible.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-muted-foreground"
                >
                  No audit entries yet — take an action in one of the apps.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
