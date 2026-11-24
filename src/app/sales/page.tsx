"use client";

import { Plus, RotateCcw, Search, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { SaleForm } from "@/components/sales/SaleForm";
import { SaleTable } from "@/components/sales/SaleTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { TableLoadingState } from "@/components/shared/LoadingState";
import { Modal } from "@/components/shared/Modal";
import { PageHeader } from "@/components/shared/PageHeader";
import { PaymentStatusBadge } from "@/components/shared/StatusBadge";
import { useDeleteSale, useSales } from "@/hooks/useSales";
import { getApiErrorMessage } from "@/lib/axios";
import { formatDateTime, toDateInputValue } from "@/lib/date";
import { getPaymentStatus } from "@/lib/utils";
import type { PaymentStatus, Sale } from "@/types/sale";

export default function SalesPage() {
  const { data: sales = [], isLoading, isError, error, refetch } = useSales();
  const deleteMutation = useDeleteSale();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | PaymentStatus>("ALL");
  const [dateFilter, setDateFilter] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
  const [viewingSale, setViewingSale] = useState<Sale | null>(null);
  const [deletingSale, setDeletingSale] = useState<Sale | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("new") === "1") {
      const id = requestAnimationFrame(() => {
        setEditingSale(null);
        setFormOpen(true);
      });
      return () => cancelAnimationFrame(id);
    }
  }, []);

  const filteredSales = useMemo(() => {
    const q = search.trim().toLowerCase();
    return sales.filter((sale) => {
      const productName = sale.product?.name ?? "";
      if (q && !productName.toLowerCase().includes(q)) return false;

      const status = getPaymentStatus(sale.paidAmount, sale.totalAmount);
      if (statusFilter !== "ALL" && status !== statusFilter) return false;

      if (dateFilter && toDateInputValue(sale.soldAt) !== dateFilter) {
        return false;
      }

      return true;
    });
  }, [sales, search, statusFilter, dateFilter]);

  const hasActiveFilters =
    search.trim().length > 0 || statusFilter !== "ALL" || dateFilter.length > 0;

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setDateFilter("");
  };

  const handleConfirmDelete = async () => {
    if (!deletingSale) return;
    await deleteMutation.mutateAsync(deletingSale.id);
    setDeletingSale(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sales"
        description="Record customer sales, track paid and due amounts, and monitor inventory."
        action={
          <button
            type="button"
            onClick={() => {
              setEditingSale(null);
              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Create Sale
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
            placeholder="Search sales by product name..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as "ALL" | PaymentStatus)
            }
            aria-label="Filter by payment status"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            <option value="ALL">All Status</option>
            <option value="PAID">Paid</option>
            <option value="PARTIAL">Partial</option>
            <option value="UNPAID">Unpaid</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            aria-label="Filter by sale date"
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
        <TableLoadingState rows={5} columns={9} />
      ) : isError ? (
        <ErrorState
          message={getApiErrorMessage(error, "Failed to load sales.")}
          onRetry={() => refetch()}
        />
      ) : filteredSales.length === 0 ? (
        <EmptyState
          icon={<ShoppingBag className="h-6 w-6" />}
          title={hasActiveFilters ? "No matching sales" : "No sales recorded yet"}
          description={
            hasActiveFilters
              ? "Try adjusting your search, payment status, or date filter."
              : "Record your first customer sale to track revenue and stock changes."
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
                  setEditingSale(null);
                  setFormOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Create Sale
              </button>
            )
          }
        />
      ) : (
        <SaleTable
          sales={filteredSales}
          onView={(s) => setViewingSale(s)}
          onEdit={(s) => {
            setEditingSale(s);
            setFormOpen(true);
          }}
          onDelete={(s) => setDeletingSale(s)}
        />
      )}

      <SaleForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingSale(null);
        }}
        sale={editingSale}
      />

      {/* Sale Details Modal */}
      <Modal
        open={Boolean(viewingSale)}
        onClose={() => setViewingSale(null)}
        title="Sale Details"
        description={viewingSale?.product?.name ?? "Transaction breakdown"}
        maxWidth="md"
      >
        {viewingSale ? (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Product</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {viewingSale.product?.name ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Quantity</dt>
              <dd className="font-medium tabular-nums">{viewingSale.quantity}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Unit Price</dt>
              <dd>
                <CurrencyDisplay paisa={viewingSale.unitPrice} />
              </dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">
                Historical Cost Price / Unit
              </dt>
              <dd>
                <CurrencyDisplay paisa={viewingSale.costPrice} />
              </dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Total Amount</dt>
              <dd>
                <CurrencyDisplay paisa={viewingSale.totalAmount} />
              </dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Paid Amount</dt>
              <dd className="text-emerald-600 dark:text-emerald-400">
                <CurrencyDisplay paisa={viewingSale.paidAmount} />
              </dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Due Amount</dt>
              <dd>
                <CurrencyDisplay
                  paisa={Math.max(0, viewingSale.totalAmount - viewingSale.paidAmount)}
                />
              </dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Payment Status</dt>
              <dd>
                <PaymentStatusBadge
                  status={getPaymentStatus(
                    viewingSale.paidAmount,
                    viewingSale.totalAmount
                  )}
                />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Sale Date</dt>
              <dd className="text-slate-700 dark:text-slate-300">
                {formatDateTime(viewingSale.soldAt)}
              </dd>
            </div>
          </dl>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingSale)}
        onClose={() => setDeletingSale(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Sale"
        description={`Are you sure you want to delete this sale of "${deletingSale?.product?.name ?? "product"}" (${deletingSale?.quantity ?? 0} units)? Deleting a sale restores product stock on the server.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
