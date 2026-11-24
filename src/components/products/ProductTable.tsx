"use client";

import { Edit2, Eye, Trash2 } from "lucide-react";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { StockStatusBadge } from "@/components/shared/StatusBadge";
import type { Product } from "@/types/product";

interface ProductTableProps {
  products: Product[];
  onView: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function ProductTable({
  products,
  onView,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3.5">Product Name</th>
              <th className="px-4 py-3.5">Category</th>
              <th className="px-4 py-3.5 text-right">Cost Price</th>
              <th className="px-4 py-3.5 text-right">Selling Price</th>
              <th className="px-4 py-3.5">Stock</th>
              <th className="px-4 py-3.5 text-right">Profit / Unit</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {products.map((product) => {
              const profitPerUnit = product.sellingPrice - product.costPrice;
              return (
                <tr
                  key={product.id}
                  className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
                >
                  <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                    {product.name}
                  </td>
                  <td className="px-4 py-3.5 text-slate-600 dark:text-slate-300">
                    {product.category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <CurrencyDisplay paisa={product.costPrice} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <CurrencyDisplay paisa={product.sellingPrice} />
                  </td>
                  <td className="px-4 py-3.5">
                    <StockStatusBadge stock={product.stock} />
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <CurrencyDisplay
                      paisa={profitPerUnit}
                      positiveHighlight
                      negativeHighlight
                    />
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => onView(product)}
                        title="View product details"
                        aria-label={`View ${product.name}`}
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit(product)}
                        title="Edit product"
                        aria-label={`Edit ${product.name}`}
                        className="rounded-lg p-1.5 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(product)}
                        title="Delete product"
                        aria-label={`Delete ${product.name}`}
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
