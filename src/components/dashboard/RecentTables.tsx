import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { PaymentStatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/date";
import { getPaymentStatus } from "@/lib/utils";
import type { Expense } from "@/types/expense";
import type { Sale } from "@/types/sale";

export function RecentSales({ sales }: { sales: Sale[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Recent Sales
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Latest recorded customer transactions
          </p>
        </div>
        <Link
          href="/sales"
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {sales.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
          No recent sales recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3">Product</th>
                <th className="px-4 py-3 text-right">Qty</th>
                <th className="px-4 py-3 text-right">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {sales.map((sale) => {
                const status = getPaymentStatus(sale.paidAmount, sale.totalAmount);
                return (
                  <tr
                    key={sale.id}
                    className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                  >
                    <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                      {sale.product?.name ?? "Unknown Product"}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-600 dark:text-slate-300">
                      {sale.quantity}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <CurrencyDisplay paisa={sale.totalAmount} />
                    </td>
                    <td className="px-4 py-3">
                      <PaymentStatusBadge status={status} />
                    </td>
                    <td className="px-5 py-3 text-right text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(sale.soldAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export function RecentExpenses({ expenses }: { expenses: Expense[] }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Recent Expenses
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Latest shop operating expenses
          </p>
        </div>
        <Link
          href="/expenses"
          className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      {expenses.length === 0 ? (
        <div className="px-5 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
          No recent expenses recorded yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
              <tr>
                <th className="px-5 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-5 py-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  <td className="px-5 py-3 font-medium text-slate-900 dark:text-slate-100">
                    {expense.title}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                    {expense.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-rose-600 dark:text-rose-400">
                    <CurrencyDisplay paisa={expense.amount} />
                  </td>
                  <td className="px-5 py-3 text-right text-xs text-slate-500 dark:text-slate-400">
                    {formatDate(expense.expenseDate)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
