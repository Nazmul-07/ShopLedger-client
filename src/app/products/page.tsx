"use client";

import { Package, Plus, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ProductForm } from "@/components/products/ProductForm";
import { ProductTable } from "@/components/products/ProductTable";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { TableLoadingState } from "@/components/shared/LoadingState";
import { Modal } from "@/components/shared/Modal";
import { PageHeader } from "@/components/shared/PageHeader";
import { StockStatusBadge } from "@/components/shared/StatusBadge";
import { useCategories } from "@/hooks/useCategories";
import { useDeleteProduct, useProducts } from "@/hooks/useProducts";
import { getApiErrorMessage } from "@/lib/axios";
import { formatDateTime } from "@/lib/date";
import type { Product } from "@/types/product";

export default function ProductsPage() {
  const { data: products = [], isLoading, isError, error, refetch } = useProducts();
  const { data: categories = [] } = useCategories();
  const deleteMutation = useDeleteProduct();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("new") === "1") {
      const id = requestAnimationFrame(() => {
        setEditingProduct(null);
        setFormOpen(true);
      });
      return () => cancelAnimationFrame(id);
    }
  }, []);

  const productCategories = useMemo(
    () => categories.filter((c) => c.type === "PRODUCT" || c.type === "BOTH"),
    [categories]
  );

  const filteredProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (categoryFilter !== "ALL" && p.categoryId !== categoryFilter) return false;
      return true;
    });
  }, [products, search, categoryFilter]);

  const hasActiveFilters = search.trim().length > 0 || categoryFilter !== "ALL";

  const resetFilters = () => {
    setSearch("");
    setCategoryFilter("ALL");
  };

  const handleConfirmDelete = async () => {
    if (!deletingProduct) return;
    try {
      await deleteMutation.mutateAsync(deletingProduct.id);
      setDeletingProduct(null);
    } catch {
      // Error toast is handled by useDeleteProduct
      setDeletingProduct(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products & Inventory"
        description="Manage product pricing, categories, and available stock levels."
        action={
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            Add Product
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
            placeholder="Search products by name..."
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
            {productCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
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
        <TableLoadingState rows={5} columns={7} />
      ) : isError ? (
        <ErrorState
          message={getApiErrorMessage(error, "Failed to load products.")}
          onRetry={() => refetch()}
        />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={<Package className="h-6 w-6" />}
          title={hasActiveFilters ? "No matching products" : "No products yet"}
          description={
            hasActiveFilters
              ? "Try adjusting your search or category filter."
              : "Add your first product to start tracking inventory and recording sales."
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
                  setEditingProduct(null);
                  setFormOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" />
                Add Product
              </button>
            )
          }
        />
      ) : (
        <ProductTable
          products={filteredProducts}
          onView={(p) => setViewingProduct(p)}
          onEdit={(p) => {
            setEditingProduct(p);
            setFormOpen(true);
          }}
          onDelete={(p) => setDeletingProduct(p)}
        />
      )}

      <ProductForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
      />

      {/* Product Details Modal */}
      <Modal
        open={Boolean(viewingProduct)}
        onClose={() => setViewingProduct(null)}
        title={viewingProduct?.name ?? "Product Details"}
        description="Inventory and pricing breakdown"
        maxWidth="md"
      >
        {viewingProduct ? (
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Category</dt>
              <dd className="font-medium text-slate-900 dark:text-slate-100">
                {viewingProduct.category?.name ?? "—"}
              </dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Cost Price</dt>
              <dd>
                <CurrencyDisplay paisa={viewingProduct.costPrice} />
              </dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Selling Price</dt>
              <dd>
                <CurrencyDisplay paisa={viewingProduct.sellingPrice} />
              </dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Profit Per Unit</dt>
              <dd>
                <CurrencyDisplay
                  paisa={viewingProduct.sellingPrice - viewingProduct.costPrice}
                  positiveHighlight
                  negativeHighlight
                />
              </dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Stock Status</dt>
              <dd>
                <StockStatusBadge stock={viewingProduct.stock} />
              </dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2.5 dark:border-slate-800">
              <dt className="text-slate-500 dark:text-slate-400">Created</dt>
              <dd className="text-slate-700 dark:text-slate-300">
                {formatDateTime(viewingProduct.createdAt)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500 dark:text-slate-400">Last Updated</dt>
              <dd className="text-slate-700 dark:text-slate-300">
                {formatDateTime(viewingProduct.updatedAt)}
              </dd>
            </div>
          </dl>
        ) : null}
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingProduct)}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Product"
        description={`Are you sure you want to delete "${deletingProduct?.name}"? Products with existing sales may not be deletable.`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
