"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { FormField, inputClassName } from "@/components/shared/FormField";
import { Modal } from "@/components/shared/Modal";
import { useProducts } from "@/hooks/useProducts";
import { useCreateSale, useUpdateSale } from "@/hooks/useSales";
import { formatCurrency, paisaToTaka, takaToPaisa } from "@/lib/currency";
import { fromDateInputValue, toDateInputValue } from "@/lib/date";
import type { Sale } from "@/types/sale";
import { saleSchema, type SaleFormValues } from "@/validations/sale.validation";

interface SaleFormProps {
  open: boolean;
  onClose: () => void;
  sale?: Sale | null;
}

const EMPTY_PRODUCTS: never[] = [];

export function SaleForm({ open, onClose, sale }: SaleFormProps) {
  if (!open) return null;
  return (
    <SaleFormContent
      key={sale?.id ?? "new"}
      open={open}
      onClose={onClose}
      sale={sale}
    />
  );
}

function SaleFormContent({ open, onClose, sale }: SaleFormProps) {
  const isEditing = Boolean(sale);
  const { data: products = EMPTY_PRODUCTS } = useProducts();
  const createMutation = useCreateSale();
  const updateMutation = useUpdateSale();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const hasAutoSelected = useRef(false);

  const initialProduct = !sale
    ? products.find((p) => p.stock > 0) ?? products[0]
    : undefined;
  const initialPriceTaka = initialProduct
    ? paisaToTaka(initialProduct.sellingPrice)
    : 0;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors },
  } = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: sale
      ? {
          productId: sale.productId,
          quantity: sale.quantity,
          unitPrice: paisaToTaka(sale.unitPrice),
          paidAmount: paisaToTaka(sale.paidAmount),
          soldAt: toDateInputValue(sale.soldAt),
        }
      : {
          productId: initialProduct?.id ?? "",
          quantity: 1,
          unitPrice: initialPriceTaka,
          paidAmount: initialPriceTaka,
          soldAt: toDateInputValue(),
        },
  });

  useEffect(() => {
    if (sale || hasAutoSelected.current || products.length === 0) return;
    const firstInStock = products.find((p) => p.stock > 0) ?? products[0];
    if (firstInStock) {
      hasAutoSelected.current = true;
      const priceTaka = paisaToTaka(firstInStock.sellingPrice);
      setValue("productId", firstInStock.id);
      setValue("unitPrice", priceTaka);
      setValue("paidAmount", priceTaka);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  const selectedProductId = watch("productId");
  const quantity = watch("quantity");
  const unitPriceTaka = watch("unitPrice");
  const paidAmountTaka = watch("paidAmount");

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) ?? null,
    [products, selectedProductId]
  );

  const maxAllowedQuantity = useMemo(() => {
    if (!selectedProduct) return 0;
    if (isEditing && sale && sale.productId === selectedProduct.id) {
      return selectedProduct.stock + sale.quantity;
    }
    return selectedProduct.stock;
  }, [selectedProduct, isEditing, sale]);

  const totalPaisa = useMemo(() => {
    if (!Number.isFinite(quantity) || !Number.isFinite(unitPriceTaka)) return 0;
    return Math.max(0, Math.round(quantity * Math.round(unitPriceTaka * 100)));
  }, [quantity, unitPriceTaka]);

  const paidPaisa = useMemo(() => {
    if (!Number.isFinite(paidAmountTaka)) return 0;
    return Math.max(0, Math.round(paidAmountTaka * 100));
  }, [paidAmountTaka]);

  const duePaisa = totalPaisa - paidPaisa;

  const handleProductChange = (newProductId: string) => {
    setValue("productId", newProductId, { shouldValidate: true });
    const prod = products.find((p) => p.id === newProductId);
    if (prod && !isEditing) {
      const priceTaka = paisaToTaka(prod.sellingPrice);
      setValue("unitPrice", priceTaka, { shouldValidate: true });
      const currentQty = Number.isFinite(quantity) && quantity > 0 ? quantity : 1;
      setValue("paidAmount", Number((priceTaka * currentQty).toFixed(2)), {
        shouldValidate: true,
      });
    }
  };

  const onSubmit = async (values: SaleFormValues) => {
    if (!selectedProduct) {
      setError("productId", { message: "Please select a valid product" });
      return;
    }

    if (values.quantity > maxAllowedQuantity) {
      setError("quantity", {
        message: `Quantity cannot exceed available stock (${maxAllowedQuantity})`,
      });
      return;
    }

    const payload = {
      productId: values.productId,
      quantity: values.quantity,
      unitPrice: takaToPaisa(values.unitPrice),
      paidAmount: takaToPaisa(values.paidAmount),
      soldAt: fromDateInputValue(values.soldAt),
    };

    if (isEditing && sale) {
      await updateMutation.mutateAsync({ id: sale.id, payload });
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
      title={isEditing ? "Edit Sale" : "Record New Sale"}
      description={
        isEditing
          ? "Update sale details. Changing quantity will automatically adjust product stock on the server."
          : "Select a product and enter sale quantities and payment in Taka (৳)."
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {isEditing && sale ? (
          <div className="flex items-start gap-2.5 rounded-lg border border-sky-200 bg-sky-50/80 p-3 text-xs text-sky-800 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300">
            <Info className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">
                Editing existing sale ({sale.quantity} unit(s) recorded at{" "}
                {formatCurrency(sale.unitPrice)} each).
              </p>
              <p className="mt-0.5 opacity-90">
                Historical cost price ({formatCurrency(sale.costPrice)}/unit) is
                preserved by the server and cannot be modified.
              </p>
            </div>
          </div>
        ) : null}

        <FormField
          label="Product"
          htmlFor="sale-product"
          required
          error={errors.productId?.message}
        >
          <select
            id="sale-product"
            className={inputClassName}
            disabled={isPending || products.length === 0}
            value={selectedProductId}
            onChange={(e) => handleProductChange(e.target.value)}
          >
            <option value="">Select a product</option>
            {products.map((prod) => (
              <option key={prod.id} value={prod.id}>
                {prod.name} — Stock: {prod.stock} ({formatCurrency(prod.sellingPrice)})
              </option>
            ))}
          </select>
        </FormField>

        {selectedProduct ? (
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs dark:border-slate-700 dark:bg-slate-800/50">
            <span className="text-slate-600 dark:text-slate-300">
              Available Stock:{" "}
              <strong className="text-slate-900 dark:text-white">
                {selectedProduct.stock}
              </strong>
              {isEditing && sale && sale.productId === selectedProduct.id
                ? ` (Max editable: ${maxAllowedQuantity})`
                : ""}
            </span>
            <span className="text-slate-600 dark:text-slate-300">
              Default Selling Price:{" "}
              <strong className="text-slate-900 dark:text-white">
                {formatCurrency(selectedProduct.sellingPrice)}
              </strong>
            </span>
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Quantity"
            htmlFor="sale-quantity"
            required
            error={errors.quantity?.message}
          >
            <input
              id="sale-quantity"
              type="number"
              step="1"
              min="1"
              max={maxAllowedQuantity || undefined}
              className={inputClassName}
              disabled={isPending}
              {...register("quantity", { valueAsNumber: true })}
            />
          </FormField>

          <FormField
            label="Unit Selling Price (৳)"
            htmlFor="sale-unit-price"
            required
            error={errors.unitPrice?.message}
          >
            <input
              id="sale-unit-price"
              type="number"
              step="0.01"
              min="0"
              className={inputClassName}
              disabled={isPending}
              {...register("unitPrice", { valueAsNumber: true })}
            />
          </FormField>

          <FormField
            label="Paid Amount (৳)"
            htmlFor="sale-paid-amount"
            required
            error={errors.paidAmount?.message}
          >
            <input
              id="sale-paid-amount"
              type="number"
              step="0.01"
              min="0"
              className={inputClassName}
              disabled={isPending}
              {...register("paidAmount", { valueAsNumber: true })}
            />
          </FormField>

          <FormField
            label="Sale Date"
            htmlFor="sale-date"
            error={errors.soldAt?.message}
          >
            <input
              id="sale-date"
              type="date"
              className={inputClassName}
              disabled={isPending}
              {...register("soldAt")}
            />
          </FormField>
        </div>

        {/* Live Totals */}
        <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/50">
          <div>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Total Amount
            </p>
            <p className="mt-1 text-lg font-bold tabular-nums text-slate-900 dark:text-white">
              {formatCurrency(totalPaisa)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Due Amount
            </p>
            <p
              className={
                duePaisa > 0
                  ? "mt-1 text-lg font-bold tabular-nums text-amber-600 dark:text-amber-400"
                  : duePaisa < 0
                    ? "mt-1 text-lg font-bold tabular-nums text-rose-600 dark:text-rose-400"
                    : "mt-1 text-lg font-bold tabular-nums text-emerald-600 dark:text-emerald-400"
              }
            >
              {formatCurrency(duePaisa)}
            </p>
          </div>
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
            disabled={isPending || !selectedProduct}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isEditing ? "Save Changes" : "Record Sale"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
