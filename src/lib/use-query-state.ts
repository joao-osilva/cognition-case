"use client";

import { useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";

export function useQueryState(
  key: string,
  defaultValue: string
): [string, (value: string) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get(key) ?? defaultValue;

  const setValue = useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next === defaultValue) params.delete(key);
      else params.set(key, next);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [key, defaultValue, pathname, router, searchParams]
  );

  return [value, setValue];
}
