"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";

export interface ApiErrorBody {
  error?: string;
  code?: string;
  params?: Record<string, string>;
}

export function useApiErrorMessage() {
  const t = useTranslations("apiErrors");
  const tCommon = useTranslations("common");

  return useCallback(
    (data: ApiErrorBody | null | undefined): string => {
      if (data?.code && t.has(data.code)) return t(data.code, data.params);
      return data?.error ?? tCommon("genericError");
    },
    [t, tCommon]
  );
}
