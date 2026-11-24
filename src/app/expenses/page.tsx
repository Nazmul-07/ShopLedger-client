"use client";

import { Plus, Receipt, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { ExpenseTable } from "@/components/expenses/ExpenseTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { TableLoadingState } from "@/components/shared/LoadingState";
import { Modal } from "@/components/shared/Modal";
import { PageHeader } from "@/components/shared/PageHeader";
import { useCategories } from "@/hooks/useCategories";
import { useDeleteExpense, useExpenses } from "@/hooks/useExpenses";
import { getApiErrorMessage } from "@/lib/axios";
import { formatDate, formatDateTime, toDateInputValue } from "@/lib/date";
import type { Expense } from "@/types/expense";

export default function ExpensesPage() {
  const { data: expenses = [], isLoading, isError, error, refetch } = useExpenses();
  const { data: categories = [] } = useCategories();
  const deleteMutation = useDeleteExpense();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [viewingExpense, setViewingExpense] = useState<Expense | null>(null);
  const [deletingExpense, setDeletingExpense] = useState<Expense | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("new") === "1") {
      const id = requestAnimationFrame(() => {
        setEditingExpense(null);
        setFormOpen(true);
      });
      return () => cancelAnimationFrame(id);
    }
  }, []);

  const expenseCategories = useMemo(
    () => categories.filter((c) => c.type === "EXPENSE" || c.type === "BOTH"),
    [categories]
  );

  const filteredExpenses = useMemo(() => {
    const q = search.trim().toLowerCase();
    return expenses.filter((exp) => {
      if (q && !exp.title.toLowerCase().includes(q)) return false;
      if (categoryFilter !== "ALL" && exp.categoryId !== categoryFilter) {
        return false;
      }
      if (dateFilter && toDateInputValue(exp.expenseDate) !== dateFilter) {
        return false;
      }
      return true;
    });
  }, [expenses, search, categoryFilter, dateFilter]);

  const hasActiveFilters =
    search.trim().length > 0 || categoryFilter !== "ALL" || dateFilter.length > 0;

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("ALL");
    setDateFilter("");
  };

  const handleConfirmDelete = async () => {
    if (!deletingExpense) return;
    await deleteMutation.mutateAsync(deletingExpense.id);
    setDeletingExpense(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expenses"
        description="Track daily shop expenses, bills, and operating costs."
        action={
          <button
            type="button"
            onClick={() => {
              setEditingExpense(null);
              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Expense
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
            placeholder="Search expenses by title..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            aria-label="Filter by category"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Categories</option>
            {expenseCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            aria-label="Filter by expense date"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />

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
        <TableLoadingState rows={5} columns={6} />
      ) : isError ? (
        <ErrorState
          message={getApiErrorMessage(error, "Failed to load expenses.")}
          onRetry={() => refetch()}
        />
      ) : filteredExpenses.length === 0 ? (
        <EmptyState
          icon={<Receipt className="h-6 w-6" />}
          title={hasActiveFilters ? "No matching expenses" : "No expenses recorded yet"}
          description={
            hasActiveFilters
              ? "Try adjusting your search, category, or date filter."
              : "Add your first daily expense to track net profit accurately."
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
                  setEditingExpense(null);
                  setFormOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add Expense
              </button>
            )
          }
        />
      ) : (
        <ExpenseTable
          expenses={filteredExpenses}
          onView={(exp) => setViewingExpense(exp)}
          onEdit={(exp) => {
            setEditingExpense(exp);
            setFormOpen(true);
          }}
          onDelete={(exp) => setDeletingExpense(exp)}
        />
      )}

      <ExpenseForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingExpense(null);
        }}
        expense={editingExpense}
      />

      {/* Expense Details Modal */}
      <Modal
        open={Boolean(viewingExpense)}
        onClose={() => setViewingExpense(null)}
        title={viewingExpense?.title ?? "Expense Details"}
        description="Expense record details"
        maxWidth="md"
      >
        {viewingExpense ? (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Category</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {viewingExpense.category?.name ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Amount</dt>
              <dd className="text-rose-600 dark:text-rose-400">
                <CurrencyDisplay paisa={viewingExpense.amount} />
              </dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Expense Date</dt>
              <dd className="text-slate-700 dark:text-slate-300">
                {formatDate(viewingExpense.expenseDate)}
              </dd>
            </div>
            <div className="border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Description</dt>
              <dd className="mt-1 text-slate-700 dark:text-slate-300">
                {viewingExpense.description || "No description provided."}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Created At</dt>
              <dd className="text-slate-700 dark:text-slate-300">
                {formatDateTime(viewingExpense.createdAt)}
              </dd>
            </div>
          </dl>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingExpense)}
        onClose={() => setDeletingExpense(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense"
        description={`Are you sure you want to delete "${deletingExpense?.title}"? This action cannot be undone.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
