"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { FormField, inputClassName } from "@/components/shared/FormField";
import { Modal } from "@/components/shared/Modal";
import { useCategories } from "@/hooks/useCategories";
import { useCreateProduct, useUpdateProduct } from "@/hooks/useProducts";
import { formatCurrency, paisaToTaka, takaToPaisa } from "@/lib/currency";
import type { Product } from "@/types/product";
import {
  productSchema,
  type ProductFormValues,
} from "@/validations/product.validation";

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  product?: Product | null;
}

const EMPTY_CATEGORIES: never[] = [];

export function ProductForm({ open, onClose, product }: ProductFormProps) {
  if (!open) return null;
  return (
    <ProductFormContent
      key={product?.id ?? "new"}
      open={open}
      onClose={onClose}
      product={product}
    />
  );
}

function ProductFormContent({ open, onClose, product }: ProductFormProps) {
  const isEditing = Boolean(product);
  const { data: categories = EMPTY_CATEGORIES } = useCategories();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const hasAutoSelected = useRef(false);

  const selectableCategories = useMemo(
    () =>
      categories.filter(
        (c) => c.isActive && (c.type === "PRODUCT" || c.type === "BOTH")
      ),
    [categories]
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? {
          name: product.name,
          categoryId: product.categoryId,
          costPrice: paisaToTaka(product.costPrice),
          sellingPrice: paisaToTaka(product.sellingPrice),
          stock: product.stock,
        }
      : {
          name: "",
          categoryId: selectableCategories[0]?.id ?? "",
          costPrice: 0,
          sellingPrice: 0,
          stock: 0,
        },
  });

  useEffect(() => {
    if (product || hasAutoSelected.current || selectableCategories.length === 0) {
      return;
    }
    hasAutoSelected.current = true;
    setValue("categoryId", selectableCategories[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectableCategories]);

  const costTaka = watch("costPrice");
  const sellingTaka = watch("sellingPrice");
  const estimatedMarginPaisa =
    Number.isFinite(costTaka) && Number.isFinite(sellingTaka)
      ? Math.round((sellingTaka - costTaka) * 100)
      : 0;

  const onSubmit = async (values: ProductFormValues) => {
    const payload = {
      name: values.name.trim(),
      categoryId: values.categoryId,
      costPrice: takaToPaisa(values.costPrice),
      sellingPrice: takaToPaisa(values.sellingPrice),
      stock: values.stock,
    };

    if (isEditing && product) {
      await updateMutation.mutateAsync({ id: product.id, payload });
    } else {
      await createMutation.mutateAsync(payload);
    }
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Product" : "Add Product"}
      description={
        isEditing
          ? "Update product pricing, category, or stock quantity."
          : "Add a new product to your shop inventory. Enter prices in Taka (৳)."
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Product Name"
          htmlFor="product-name"
          required
          error={errors.name?.message}
        >
          <input
            id="product-name"
            type="text"
            placeholder="e.g. Samsung Galaxy A15"
            className={inputClassName}
            disabled={isPending}
            {...register("name")}
          />
        </FormField>

        <FormField
          label="Category"
          htmlFor="product-category"
          required
          error={errors.categoryId?.message}
          hint={
            selectableCategories.length === 0
              ? "No active Product/Both categories found. Please create or activate one first."
              : "Only active Product or Both categories are available."
          }
        >
          <select
            id="product-category"
            className={inputClassName}
            disabled={isPending || selectableCategories.length === 0}
            {...register("categoryId")}
          >
            <option value="">Select a category</option>
            {selectableCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.type})
              </option>
            ))}
          </select>
        </FormField>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            label="Cost Price (৳)"
            htmlFor="product-cost"
            required
            error={errors.costPrice?.message}
          >
            <input
              id="product-cost"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              className={inputClassName}
              disabled={isPending}
              {...register("costPrice", { valueAsNumber: true })}
            />
          </FormField>

          <FormField
            label="Selling Price (৳)"
            htmlFor="product-selling"
            required
            error={errors.sellingPrice?.message}
          >
            <input
              id="product-selling"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              className={inputClassName}
              disabled={isPending}
              {...register("sellingPrice", { valueAsNumber: true })}
            />
          </FormField>

          <FormField
            label="Stock Quantity"
            htmlFor="product-stock"
            required
            error={errors.stock?.message}
          >
            <input
              id="product-stock"
              type="number"
              step="1"
              min="0"
              placeholder="0"
              className={inputClassName}
              disabled={isPending}
              {...register("stock", { valueAsNumber: true })}
            />
          </FormField>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm dark:border-slate-700 dark:bg-slate-800/50">
          <span className="text-slate-600 dark:text-slate-300">
            Estimated Profit Per Unit
          </span>
          <span
            className={
              estimatedMarginPaisa >= 0
                ? "font-semibold tabular-nums text-emerald-600 dark:text-emerald-400"
                : "font-semibold tabular-nums text-rose-600 dark:text-rose-400"
            }
          >
            {formatCurrency(estimatedMarginPaisa)}
          </span>
        </div>

        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending || selectableCategories.length === 0}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isEditing ? "Save Changes" : "Create Product"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
