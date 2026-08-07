"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import {
  ClipboardCheckIcon,
  FlagIcon,
  GripIcon,
  HomeIcon,
  LayoutGridIcon,
  PanelLeftIcon,
  ReceiptIcon,
  ScrollTextIcon,
  SearchIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useRole } from "./RoleContext";
import { ThemeToggle } from "./ThemeToggle";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Role } from "@/lib/types";

interface NavItem {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavGroup {
  labelKey: string;
  items: NavItem[];
}

const GROUPS: NavGroup[] = [
  {
    labelKey: "internalTools",
    items: [
      { href: "/apps/kyc", labelKey: "kyc", icon: ClipboardCheckIcon },
      { href: "/apps/refunds", labelKey: "refunds", icon: ReceiptIcon },
      { href: "/apps/flags", labelKey: "flags", icon: FlagIcon },
    ],
  },
  {
    labelKey: "governance",
    items: [{ href: "/audit", labelKey: "audit", icon: ScrollTextIcon }],
  },
  {
    labelKey: "assessment",
    items: [
      {
        href: "/analysis/research",
        labelKey: "research",
        icon: LayoutGridIcon,
      },
      {
        href: "/analysis/evaluation",
        labelKey: "evaluation",
        icon: LayoutGridIcon,
      },
      {
        href: "/analysis/recommendation",
        labelKey: "recommendation",
        icon: LayoutGridIcon,
      },
    ],
  },
];

const ROLE_INITIALS: Record<Role, string> = {
  viewer: "VW",
  approver: "AP",
  admin: "AD",
};

function SidebarLink({
  item,
  label,
  active,
  collapsed,
}: {
  item: NavItem;
  label: string;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      title={collapsed ? label : undefined}
      className={cn(
        "relative flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm",
        active
          ? "bg-accent font-medium text-accent-foreground before:absolute before:inset-y-1 before:left-0 before:w-0.5 before:rounded-full before:bg-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className={cn("size-4 shrink-0", active && "text-primary")} />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role, setRole } = useRole();
  const [collapsed, setCollapsed] = useState(false);
  const t = useTranslations("shell");
  const tNav = useTranslations("shell.nav");
  const tRoles = useTranslations("roles");

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-12 shrink-0 items-center gap-3 bg-primary px-3 text-primary-foreground">
        <GripIcon aria-hidden="true" className="size-4 opacity-80" />
        <Link href="/" className="text-sm font-semibold tracking-tight">
          {t("appName")}
        </Link>
        <span
          aria-hidden="true"
          className="hidden text-primary-foreground/50 sm:inline"
        >
          |
        </span>
        <span className="hidden text-sm text-primary-foreground/80 sm:inline">
          {t("area")}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative hidden md:block">
            <SearchIcon
              aria-hidden="true"
              className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-primary-foreground/60"
            />
            <input
              type="search"
              name="q"
              placeholder={t("searchPlaceholder")}
              aria-label={t("searchLabel")}
              spellCheck={false}
              autoComplete="off"
              className="h-8 w-56 rounded-md bg-primary-foreground/10 pl-8 pr-3 text-sm text-primary-foreground placeholder:text-primary-foreground/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-foreground/40"
            />
          </div>
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger
              size="sm"
              aria-label={t("roleLabel")}
              className="w-28 border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground *:data-[slot=select-value]:text-primary-foreground [&_svg:not([class*='text-'])]:text-primary-foreground/70"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="viewer">{tRoles("viewer")}</SelectItem>
                <SelectItem value="approver">{tRoles("approver")}</SelectItem>
                <SelectItem value="admin">{tRoles("admin")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <LocaleSwitcher />
          <ThemeToggle />
          <span
            role="img"
            aria-label={t("signedInAs", { role: tRoles(role) })}
            className="flex size-8 items-center justify-center rounded-full bg-primary-foreground/20 text-xs font-semibold"
          >
            {ROLE_INITIALS[role]}
          </span>
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          className={cn(
            "flex shrink-0 flex-col gap-4 border-r bg-card px-2 py-3 transition-[width] motion-reduce:transition-none",
            collapsed ? "w-12" : "w-56"
          )}
        >
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCollapsed((v) => !v)}
            aria-label={collapsed ? t("expandNav") : t("collapseNav")}
            className="self-start text-muted-foreground"
          >
            <PanelLeftIcon />
          </Button>

          <nav className="flex flex-col gap-4">
            <SidebarLink
              item={{ href: "/", labelKey: "home", icon: HomeIcon }}
              label={tNav("home")}
              active={pathname === "/"}
              collapsed={collapsed}
            />
            {GROUPS.map((group) => (
              <div key={group.labelKey} className="flex flex-col gap-0.5">
                {!collapsed && (
                  <div className="px-2.5 pb-1 text-xs font-semibold text-foreground">
                    {tNav(group.labelKey)}
                  </div>
                )}
                {group.items.map((item) => (
                  <SidebarLink
                    key={item.href}
                    item={item}
                    label={tNav(item.labelKey)}
                    active={pathname.startsWith(item.href)}
                    collapsed={collapsed}
                  />
                ))}
              </div>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
