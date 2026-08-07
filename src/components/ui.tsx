"use client";

import { AlertCircleIcon, XIcon } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("status");
  return (
    <Badge variant={VALUE_VARIANTS[value] ?? "secondary"}>
      {t.has(value) ? t(value) : value.replace("_", " ")}
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
  const t = useTranslations("common");
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircleIcon />
      <AlertDescription className="flex items-center justify-between gap-4">
        <span>{message}</span>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onDismiss}
          aria-label={t("dismiss")}
        >
          <XIcon />
        </Button>
      </AlertDescription>
    </Alert>
  );
}

export function PageHeader({
  title,
  subtitle,
  icon: Icon,
}: {
  title: string;
  subtitle: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="mb-6 flex items-start gap-3">
      {Icon && (
        <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon aria-hidden="true" className="size-5" />
        </span>
      )}
      <div>
        <h1 className="text-balance text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="mt-1 max-w-3xl text-pretty text-sm text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </div>
  );
}
