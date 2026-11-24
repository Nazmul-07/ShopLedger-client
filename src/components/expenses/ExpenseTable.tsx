"use client";

import { Edit2, Eye, Trash2 } from "lucide-react";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { formatDate } from "@/lib/date";
import type { Expense } from "@/types/expense";

interface ExpenseTableProps {
  expenses: Expense[];
  onView: (expense: Expense) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
}

export function ExpenseTable({
  expenses,
  onView,
  onEdit,
  onDelete,
}: ExpenseTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3.5">Title</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5 text-right">Amount</th>
              <th className="px-4 py-3.5">Description</th>
              <th className="px-4 py-3.5">Expense Date</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
              >
                <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                  {expense.title}
                </td>
                <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                  {expense.category?.name ?? "—"}
                </td>
                <td className="px-4 py-3.5 text-right text-rose-600 dark:text-rose-400">
                  <CurrencyDisplay paisa={expense.amount} />
                </td>
                <td className="max-w-xs truncate px-4 py-3.5 text-slate-500 dark:text-slate-400">
                  {expense.description || "—"}
                </td>
                <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">
                  {formatDate(expense.expenseDate)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onView(expense)}
                      title="View expense details"
                      aria-label={`View ${expense.title}`}
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(expense)}
                      title="Edit expense"
                      aria-label={`Edit ${expense.title}`}
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(expense)}
                      title="Delete expense"
                      aria-label={`Delete ${expense.title}`}
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/60 dark:hover:text-rose-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
