"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Role } from "@/lib/types";

interface RoleContextValue {
  role: Role;
  setRole: (role: Role) => Promise<void>;
}

const RoleContext = createContext<RoleContextValue>({
  role: "viewer",
  setRole: async () => {},
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>("viewer");

  useEffect(() => {
    fetch("/api/role")
      .then((r) => r.json())
      .then((d) => setRoleState(d.role));
  }, []);

  async function setRole(next: Role) {
    await fetch("/api/role", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: next }),
    });
    setRoleState(next);
  }

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
