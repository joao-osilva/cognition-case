"use client";

import { useCallback, useEffect, useState } from "react";
import { useRole } from "@/components/RoleContext";
import { ErrorBanner, PageHeader, StatusBadge } from "@/components/ui";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
      {error && !selected && (
        <ErrorBanner message={error} onDismiss={() => setError("")} />
      )}

      <div className="mb-4 flex flex-wrap gap-3">
        <Input
          placeholder="Search name, email, ID, country…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-72"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40" aria-label="Status filter">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_review">In review</SelectItem>
              <SelectItem value="escalated">Escalated</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-mono text-xs">{c.id}</TableCell>
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
                <TableCell className="text-xs text-muted-foreground">
                  {new Date(c.submittedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelected(c);
                      setNotes("");
                      setError("");
                    }}
                  >
                    Review
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {visible.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="py-8 text-center text-muted-foreground"
                >
                  No cases match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selected.customerName}
                  <StatusBadge value={selected.status} />
                </DialogTitle>
                <DialogDescription className="font-mono text-xs">
                  {selected.id}
                </DialogDescription>
              </DialogHeader>
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd>{selected.customerEmail}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Country</dt>
                  <dd>{selected.country}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Document</dt>
                  <dd>{selected.documentType}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Risk level</dt>
                  <dd>
                    <StatusBadge value={selected.riskLevel} />
                  </dd>
                </div>
              </dl>
              {selected.notes && (
                <p className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                  {selected.notes}
                </p>
              )}

              {canDecide ? (
                <>
                  <Textarea
                    placeholder="Decision note (required for reject / escalate)…"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={2}
                  />
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                  <DialogFooter className="flex-wrap sm:justify-start">
                    {selected.status === "pending" && (
                      <Button
                        variant="secondary"
                        onClick={() => act(selected.id, "start_review")}
                      >
                        Start review
                      </Button>
                    )}
                    <Button onClick={() => act(selected.id, "approve")}>
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => act(selected.id, "reject")}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => act(selected.id, "escalate")}
                    >
                      Escalate
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <Alert>
                  <AlertDescription>
                    You are a <strong>viewer</strong> — switch to approver or
                    admin to make decisions.
                  </AlertDescription>
                </Alert>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
