"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "./RoleContext";
import { StatusBadge } from "./ui";
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

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/apps/kyc", label: "KYC Queue" },
  { href: "/apps/refunds", label: "Refunds" },
  { href: "/apps/flags", label: "Feature Flags" },
  { href: "/audit", label: "Audit Log" },
  { href: "/analysis/research", label: "Analysis" },
];

export function Nav() {
  const pathname = usePathname();
  const { role, setRole } = useRole();

  return (
    <header className="border-b bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          Fintech Internal Tools
        </Link>
        <nav className="flex flex-wrap gap-1 text-sm">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : link.href.startsWith("/analysis")
                  ? pathname.startsWith("/analysis")
                  : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-md px-3 py-1.5",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <StatusBadge value={role} />
          <Select value={role} onValueChange={(v) => setRole(v as Role)}>
            <SelectTrigger size="sm" aria-label="Role" className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="viewer">Viewer</SelectItem>
                <SelectItem value="approver">Approver</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
