"use client";

import { ChevronDownIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function CommandBar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1 rounded-t-lg border border-b-0 bg-card px-2 py-1.5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CommandButton({
  icon: Icon,
  children,
  ...props
}: React.ComponentProps<typeof Button> & {
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Button variant="ghost" size="sm" {...props}>
      <Icon className="size-4" />
      {children}
    </Button>
  );
}

export interface ViewOption {
  value: string;
  label: string;
}

export function ViewSelector({
  value,
  onChange,
  options,
  ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: ViewOption[];
  ariaLabel: string;
}) {
  const current = options.find((o) => o.value === value) ?? options[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          aria-label={ariaLabel}
          className="h-9 gap-1 px-2 text-base font-semibold"
        >
          {current.label}
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {options.map((o) => (
          <DropdownMenuItem
            key={o.value}
            onSelect={() => onChange(o.value)}
            data-active={o.value === value}
            className="data-[active=true]:font-medium"
          >
            {o.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function GridFooter({ count, label }: { count: number; label: string }) {
  const t = useTranslations("common");
  return (
    <div className="rounded-b-lg border border-t-0 bg-card px-3 py-1.5 text-xs tabular-nums text-muted-foreground">
      {t("gridFooter", { count, label })}
    </div>
  );
}
