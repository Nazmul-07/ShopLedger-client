"use client";

import { Edit2, Eye, Trash2 } from "lucide-react";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { PaymentStatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/date";
import { getPaymentStatus } from "@/lib/utils";
import type { Sale } from "@/types/sale";

interface SaleTableProps {
  sales: Sale[];
  onView: (sale: Sale) => void;
  onEdit: (sale: Sale) => void;
  onDelete: (sale: Sale) => void;
}

export function SaleTable({ sales, onView, onEdit, onDelete }: SaleTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3.5">Product</th>
              <th className="px-4 py-3.5 text-right">Qty</th>
              <th className="px-4 py-3.5 text-right">Unit Price</th>
              <th className="px-4 py-3.5 text-right">Total</th>
              <th className="px-4 py-3.5 text-right">Paid</th>
              <th className="px-4 py-3.5 text-right">Due</th>
              <th className="px-4 py-3.5">Sale Date</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {sales.map((sale) => {
              const dueAmount = Math.max(0, sale.totalAmount - sale.paidAmount);
              const status = getPaymentStatus(sale.paidAmount, sale.totalAmount);
              return (
                <tr
                  key={sale.id}
                  className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                    {sale.product?.name ?? "Unknown Product"}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-slate-600 dark:text-slate-300">
                    {sale.quantity}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <CurrencyDisplay paisa={sale.unitPrice} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <CurrencyDisplay paisa={sale.totalAmount} />
                  </td>
                  <td className="px-4 py-3.5 text-right text-emerald-600 dark:text-emerald-400">
                    <CurrencyDisplay paisa={sale.paidAmount} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <CurrencyDisplay
                      paisa={dueAmount}
                      className={
                        dueAmount > 0
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-slate-500 dark:text-slate-400"
                      }
                    />
                  </td>
                  <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">
                    {formatDate(sale.soldAt)}
                  </td>
                  <td className="px-4 py-3.5">
                    <PaymentStatusBadge status={status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView(sale)}
                        title="View sale details"
                        aria-label="View sale details"
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(sale)}
                        title="Edit sale"
                        aria-label="Edit sale"
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(sale)}
                        title="Delete sale"
                        aria-label="Delete sale"
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 dark:text-slate-400 dark:hover:bg-rose-950/60 dark:hover:text-rose-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
