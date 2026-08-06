"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRole } from "./RoleContext";
import { Role } from "@/lib/types";

const LINKS = [
  { href: "/", label: "Overview" },
  { href: "/apps/kyc", label: "KYC Queue" },
  { href: "/apps/refunds", label: "Refunds" },
  { href: "/apps/flags", label: "Feature Flags" },
  { href: "/audit", label: "Audit Log" },
  { href: "/analysis/research", label: "Analysis" },
];

const ROLE_STYLES: Record<Role, string> = {
  viewer: "bg-slate-200 text-slate-700",
  approver: "bg-amber-200 text-amber-800",
  admin: "bg-rose-200 text-rose-800",
};

export function Nav() {
  const pathname = usePathname();
  const { role, setRole } = useRole();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight text-slate-900">
          Fintech Internal Tools
        </Link>
        <nav className="flex flex-wrap gap-1 text-sm">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href.split("/").slice(0, 2).join("/")) &&
                  (link.href !== "/audit" || pathname.startsWith("/audit"));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-1.5 ${
                  active
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2 text-sm">
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_STYLES[role]}`}
          >
            {role}
          </span>
          <label htmlFor="role-select" className="text-slate-500">
            Role
          </label>
          <select
            id="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
            className="rounded-md border border-slate-300 bg-white px-2 py-1"
          >
            <option value="viewer">Viewer</option>
            <option value="approver">Approver</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
    </header>
  );
}
