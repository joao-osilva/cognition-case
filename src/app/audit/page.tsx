"use client";

import { useCallback, useEffect, useState } from "react";
import { RefreshCwIcon } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/ui";
import {
  CommandBar,
  CommandButton,
  GridFooter,
  ViewSelector,
} from "@/components/grid";
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

  const load = useCallback(() => {
    fetch("/api/audit")
      .then((r) => r.json())
      .then((d) => setEntries(d.audit));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = entries.filter(
    (e) => appFilter === "all" || e.app === appFilter
  );

  return (
    <div>
      <PageHeader
        title="Audit Log"
        subtitle="Every state-changing action across all three apps: who did it, in what role, and the before/after values. Mirrors Dataverse auditing."
      />

      <CommandBar>
        <CommandButton icon={RefreshCwIcon} onClick={load}>
          Refresh
        </CommandButton>
      </CommandBar>

      <div className="border-x bg-card px-2 py-1.5">
        <ViewSelector
          value={appFilter}
          onChange={setAppFilter}
          options={[
            { value: "all", label: "All app activity" },
            { value: "kyc", label: "KYC activity" },
            { value: "refunds", label: "Refunds activity" },
            { value: "flags", label: "Feature-flag activity" },
          ]}
          ariaLabel="View"
        />
      </div>

      <div className="border bg-card">
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
      <GridFooter count={visible.length} label="entries" />
    </div>
  );
}
