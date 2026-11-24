"use client";

import { FolderKanban, Plus, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CategoryForm } from "@/components/categories/CategoryForm";
import { CategoryTable } from "@/components/categories/CategoryTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { TableLoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  useCategories,
  useDeleteCategory,
  useUpdateCategory,
} from "@/hooks/useCategories";
import { getApiErrorMessage } from "@/lib/axios";
import type { Category, CategoryType } from "@/types/category";

export default function CategoriesPage() {
  const { data: categories = [], isLoading, isError, error, refetch } = useCategories();
  const deleteMutation = useDeleteCategory();
  const updateMutation = useUpdateCategory();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"ALL" | CategoryType>("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");

  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("new") === "1") {
      const id = requestAnimationFrame(() => {
        setEditingCategory(null);
        setFormOpen(true);
      });
      return () => cancelAnimationFrame(id);
    }
  }, []);

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    return categories.filter((cat) => {
      if (q && !cat.name.toLowerCase().includes(q)) return false;
      if (typeFilter !== "ALL" && cat.type !== typeFilter) return false;
      if (statusFilter === "ACTIVE" && !cat.isActive) return false;
      if (statusFilter === "INACTIVE" && cat.isActive) return false;
      return true;
    });
  }, [categories, search, typeFilter, statusFilter]);

  const hasActiveFilters =
    search.trim().length > 0 || typeFilter !== "ALL" || statusFilter !== "ALL";

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
  };

  const handleToggleActive = async (category: Category) => {
    setTogglingId(category.id);
    try {
      await updateMutation.mutateAsync({
        id: category.id,
        payload: { isActive: !category.isActive },
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingCategory) return;
    await deleteMutation.mutateAsync(deletingCategory.id);
    setDeletingCategory(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        description="Organize your products and expenses into active categories."
        action={
          <button
            type="button"
            onClick={() => {
              setEditingCategory(null);
              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        }
      />

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center dark:border-slate-800 dark:bg-slate-900">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories by name..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as "ALL" | CategoryType)}
            aria-label="Filter by category type"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Types</option>
            <option value="PRODUCT">Product</option>
            <option value="EXPENSE">Expense</option>
            <option value="BOTH">Both</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "INACTIVE")
            }
            aria-label="Filter by status"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          ) : null}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <TableLoadingState rows={5} columns={5} />
      ) : isError ? (
        <ErrorState
          message={getApiErrorMessage(error, "Failed to load categories.")}
          onRetry={() => refetch()}
        />
      ) : filteredCategories.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-6 w-6" />}
          title={hasActiveFilters ? "No matching categories" : "No categories yet"}
          description={
            hasActiveFilters
              ? "Try adjusting your search or filter criteria."
              : "Create your first product or expense category to get started."
          }
          action={
            hasActiveFilters ? (
              <button
                type="button"
                onClick={resetFilters}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              >
                Clear filters
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setEditingCategory(null);
                  setFormOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add Category
              </button>
            )
          }
        />
      ) : (
        <CategoryTable
          categories={filteredCategories}
          onEdit={(cat) => {
            setEditingCategory(cat);
            setFormOpen(true);
          }}
          onToggleActive={handleToggleActive}
          onDelete={(cat) => setDeletingCategory(cat)}
          togglingId={togglingId}
        />
      )}

      <CategoryForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
      />

      <ConfirmDialog
        open={Boolean(deletingCategory)}
        onClose={() => setDeletingCategory(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Category"
        description={`Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
