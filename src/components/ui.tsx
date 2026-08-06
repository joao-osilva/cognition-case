"use client";

import { AlertCircleIcon, XIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type BadgeVariant = "default" | "secondary" | "destructive" | "success" | "warning" | "outline";

const VALUE_VARIANTS: Record<string, BadgeVariant> = {
  pending: "secondary",
  in_review: "default",
  approved: "success",
  rejected: "destructive",
  escalated: "warning",
  requested: "secondary",
  processed: "success",
  low: "success",
  medium: "warning",
  high: "destructive",
  development: "secondary",
  staging: "warning",
  production: "destructive",
  viewer: "secondary",
  approver: "warning",
  admin: "destructive",
};

export function StatusBadge({ value }: { value: string }) {
  return (
    <Badge variant={VALUE_VARIANTS[value] ?? "secondary"}>
      {value.replace("_", " ")}
    </Badge>
  );
}

export function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss: () => void;
}) {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircleIcon />
      <AlertDescription className="flex items-center justify-between gap-4">
        <span>{message}</span>
        <Button variant="ghost" size="icon-sm" onClick={onDismiss} aria-label="Dismiss">
          <XIcon />
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}
