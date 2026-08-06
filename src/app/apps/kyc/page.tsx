"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { RefreshCwIcon } from "lucide-react";
import { PageHeader, StatusBadge } from "@/components/ui";
import {
  CommandBar,
  CommandButton,
  GridFooter,
  ViewSelector,
} from "@/components/grid";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQueryState } from "@/lib/use-query-state";
import { KycCase } from "@/lib/types";

const VIEWS = [
  { value: "all", label: "All cases" },
  { value: "pending", label: "Pending cases" },
  { value: "in_review", label: "Cases in review" },
  { value: "escalated", label: "Escalated cases" },
  { value: "approved", label: "Approved cases" },
  { value: "rejected", label: "Rejected cases" },
];

function KycPageContent() {
  const [cases, setCases] = useState<KycCase[]>([]);
  const [search, setSearch] = useQueryState("q", "");
  const [view, setView] = useQueryState("view", "all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    const res = await fetch("/api/kyc");
    const data = await res.json();
    setCases(data.cases);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = cases.filter((c) => {
    const matchesSearch =
      !search ||
      `${c.customerName} ${c.customerEmail} ${c.id} ${c.country}`
        .toLowerCase()
        .includes(search.toLowerCase());
    const matchesStatus = view === "all" || c.status === view;
    return matchesSearch && matchesStatus;
  });

  const allSelected =
    visible.length > 0 && visible.every((c) => selected.has(c.id));

  function toggleAll(checked: boolean) {
    setSelected(checked ? new Set(visible.map((c) => c.id)) : new Set());
  }

  function toggleOne(id: string, checked: boolean) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  return (
    <div>
      <PageHeader
        title="KYC Review Queue"
        subtitle="Identity verification cases awaiting compliance review. Open a case to review it; decisions require the approver role."
      />
      <CommandBar>
        <CommandButton icon={RefreshCwIcon} onClick={load}>
          Refresh
        </CommandButton>
        {selected.size > 0 && (
          <span className="ml-2 text-xs tabular-nums text-muted-foreground">
            {selected.size} selected
          </span>
        )}
        <div className="ml-auto">
          <Input
            type="search"
            placeholder="Search this view…"
            aria-label="Search cases"
            spellCheck={false}
            autoComplete="off"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-64"
          />
        </div>
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
                  aria-label="Select all cases"
                />
              </TableHead>
              <TableHead>Case</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((c) => (
              <TableRow key={c.id} data-state={selected.has(c.id) ? "selected" : undefined}>
                <TableCell>
                  <Checkbox
                    checked={selected.has(c.id)}
                    onCheckedChange={(v) => toggleOne(c.id, v === true)}
                    aria-label={`Select ${c.id}`}
                  />
                </TableCell>
                <TableCell className="font-mono text-xs">
                  <Link
                    href={`/apps/kyc/${c.id}`}
                    className="text-primary hover:underline"
                  >
                    {c.id}
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="font-medium">{c.customerName}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.customerEmail}
                  </div>
                </TableCell>
                <TableCell>{c.country}</TableCell>
                <TableCell>{c.documentType}</TableCell>
                <TableCell>
                  <StatusBadge value={c.riskLevel} />
                </TableCell>
                <TableCell>
                  <StatusBadge value={c.status} />
                </TableCell>
                <TableCell className="text-xs tabular-nums text-muted-foreground">
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: "medium",
                  }).format(new Date(c.submittedAt))}
                </TableCell>
              </TableRow>
            ))}
            {visible.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-muted-foreground"
                >
                  No cases match the current view.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <GridFooter count={visible.length} label="cases" />
    </div>
  );
}

export default function KycPage() {
  return (
    <Suspense>
      <KycPageContent />
    </Suspense>
  );
}
