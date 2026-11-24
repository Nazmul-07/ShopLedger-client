import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  tone?: "indigo" | "emerald" | "amber" | "rose" | "sky" | "slate";
}

const toneStyles = {
  indigo:
    "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
  emerald:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
  amber:
    "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
  rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
  sky: "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
};

export function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  tone = "indigo",
}: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs transition hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2 truncate text-2xl font-bold tracking-tight tabular-nums text-slate-900 dark:text-white">
            {value}
          </p>
          {subtitle ? (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            toneStyles[tone]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
