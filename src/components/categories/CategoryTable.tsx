"use client";

import { Edit2, Power, Trash2 } from "lucide-react";
import {
  ActiveStatusBadge,
  CategoryTypeBadge,
} from "@/components/shared/StatusBadge";
import { formatDate } from "@/lib/date";
import type { Category } from "@/types/category";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onToggleActive: (category: Category) => void;
  onDelete: (category: Category) => void;
  togglingId?: string | null;
}

export function CategoryTable({
  categories,
  onEdit,
  onToggleActive,
  onDelete,
  togglingId,
}: CategoryTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
            <tr>
              <th className="px-5 py-3.5">Name</th>
              <th className="px-4 py-3.5">Type</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5">Created Date</th>
              <th className="px-5 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="transition hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
              >
                <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                  {cat.name}
                </td>
                <td className="px-4 py-3.5">
                  <CategoryTypeBadge type={cat.type} />
                </td>
                <td className="px-4 py-3.5">
                  <ActiveStatusBadge isActive={cat.isActive} />
                </td>
                <td className="px-4 py-3.5 text-slate-500 dark:text-slate-400">
                  {formatDate(cat.createdAt)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onToggleActive(cat)}
                      disabled={togglingId === cat.id}
                      title={cat.isActive ? "Deactivate category" : "Activate category"}
                      aria-label={cat.isActive ? "Deactivate category" : "Activate category"}
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    >
                      <Power className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(cat)}
                      title="Edit category"
                      aria-label={`Edit ${cat.name}`}
                      className="rounded-lg p-1.5 text-slate-500 transition hover:bg-indigo-50 hover:text-indigo-600 dark:text-slate-400 dark:hover:bg-indigo-950/60 dark:hover:text-indigo-400"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(cat)}
                      title="Delete category"
                      aria-label={`Delete ${cat.name}`}
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
