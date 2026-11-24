import { cn, isLowStock, isOutOfStock } from "@/lib/utils";
import type { CategoryType } from "@/types/category";
import type { PaymentStatus } from "@/types/sale";

export function CategoryTypeBadge({ type }: { type: CategoryType }) {
  const styles: Record<CategoryType, string> = {
    PRODUCT:
      "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/60",
    EXPENSE:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60",
    BOTH: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800/60",
  };

  const labels: Record<CategoryType, string> = {
    PRODUCT: "Product",
    EXPENSE: "Expense",
    BOTH: "Both",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[type]
      )}
    >
      {labels[type]}
    </span>
  );
}

export function ActiveStatusBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        isActive
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-300"
          : "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isActive ? "bg-emerald-500" : "bg-slate-400"
        )}
      />
      {isActive ? "Active" : "Inactive"}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, string> = {
    PAID: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-300",
    PARTIAL:
      "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/60 dark:text-amber-300",
    UNPAID:
      "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/60 dark:text-rose-300",
  };

  const labels: Record<PaymentStatus, string> = {
    PAID: "Paid",
    PARTIAL: "Partial",
    UNPAID: "Unpaid",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[status]
      )}
    >
      {labels[status]}
    </span>
  );
}

export function StockStatusBadge({ stock }: { stock: number }) {
  if (isOutOfStock(stock)) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-0.5 text-xs font-medium text-rose-700 dark:border-rose-800/60 dark:bg-rose-950/60 dark:text-rose-300">
        Out of stock (0)
      </span>
    );
  }

  if (isLowStock(stock)) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:border-amber-800/60 dark:bg-amber-950/60 dark:text-amber-300">
        Low ({stock})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-800/60 dark:bg-emerald-950/60 dark:text-emerald-300">
      In stock ({stock})
    </span>
  );
}
