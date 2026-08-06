"use client";

export function StatusBadge({ value }: { value: string }) {
  const styles: Record<string, string> = {
    pending: "bg-slate-100 text-slate-700",
    in_review: "bg-blue-100 text-blue-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-rose-100 text-rose-700",
    escalated: "bg-purple-100 text-purple-700",
    requested: "bg-slate-100 text-slate-700",
    processed: "bg-emerald-100 text-emerald-700",
    low: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-rose-100 text-rose-700",
    development: "bg-slate-100 text-slate-700",
    staging: "bg-amber-100 text-amber-700",
    production: "bg-rose-100 text-rose-700",
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
        styles[value] ?? "bg-slate-100 text-slate-700"
      }`}
    >
      {value.replace("_", " ")}
    </span>
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
    <div className="mb-4 flex items-center justify-between rounded-md border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-800">
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-4 font-medium hover:underline">
        Dismiss
      </button>
    </div>
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
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
        {title}
      </h1>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}
