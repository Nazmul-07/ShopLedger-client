"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { FormField, inputClassName } from "@/components/shared/FormField";
import { Modal } from "@/components/shared/Modal";
import { useCategories } from "@/hooks/useCategories";
import { useCreateExpense, useUpdateExpense } from "@/hooks/useExpenses";
import { paisaToTaka, takaToPaisa } from "@/lib/currency";
import { fromDateInputValue, toDateInputValue } from "@/lib/date";
import type { Expense } from "@/types/expense";
import {
  expenseSchema,
  type ExpenseFormValues,
} from "@/validations/expense.validation";

interface ExpenseFormProps {
  open: boolean;
  onClose: () => void;
  expense?: Expense | null;
}

const EMPTY_CATEGORIES: never[] = [];

export function ExpenseForm({ open, onClose, expense }: ExpenseFormProps) {
  if (!open) return null;
  return (
    <ExpenseFormContent
      key={expense?.id ?? "new"}
      open={open}
      onClose={onClose}
      expense={expense}
    />
  );
}

function ExpenseFormContent({ open, onClose, expense }: ExpenseFormProps) {
  const isEditing = Boolean(expense);
  const { data: categories = EMPTY_CATEGORIES } = useCategories();
  const createMutation = useCreateExpense();
  const updateMutation = useUpdateExpense();
  const isPending = createMutation.isPending || updateMutation.isPending;
  const hasAutoSelected = useRef(false);

  const selectableCategories = useMemo(
    () =>
      categories.filter(
        (c) => c.isActive && (c.type === "EXPENSE" || c.type === "BOTH")
      ),
    [categories]
  );

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense
      ? {
          title: expense.title,
          categoryId: expense.categoryId,
          amount: paisaToTaka(expense.amount),
          description: expense.description ?? "",
          expenseDate: toDateInputValue(expense.expenseDate),
        }
      : {
          title: "",
          categoryId: selectableCategories[0]?.id ?? "",
          amount: 0,
          description: "",
          expenseDate: toDateInputValue(),
        },
  });

  useEffect(() => {
    if (expense || hasAutoSelected.current || selectableCategories.length === 0) {
      return;
    }
    hasAutoSelected.current = true;
    setValue("categoryId", selectableCategories[0].id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectableCategories]);

  const onSubmit = async (values: ExpenseFormValues) => {
    const payload = {
      title: values.title.trim(),
      categoryId: values.categoryId,
      amount: takaToPaisa(values.amount),
      description: values.description?.trim() || undefined,
      expenseDate: fromDateInputValue(values.expenseDate),
    };

    if (isEditing && expense) {
      await updateMutation.mutateAsync({ id: expense.id, payload });
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
      title={isEditing ? "Edit Expense" : "Add Expense"}
      description={
        isEditing
          ? "Update expense details and amount."
          : "Record a daily business expense in Taka (৳)."
      }
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Expense Title"
          htmlFor="expense-title"
          required
          error={errors.title?.message}
        >
          <input
            id="expense-title"
            type="text"
            placeholder="e.g. Shop Electricity Bill"
            className={inputClassName}
            disabled={isPending}
            {...register("title")}
          />
        </FormField>

        <FormField
          label="Category"
          htmlFor="expense-category"
          required
          error={errors.categoryId?.message}
          hint={
            selectableCategories.length === 0
              ? "No active Expense/Both categories found. Please create or activate one first."
              : "Only active Expense or Both categories are available."
          }
        >
          <select
            id="expense-category"
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Amount (৳)"
            htmlFor="expense-amount"
            required
            error={errors.amount?.message}
          >
            <input
              id="expense-amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              className={inputClassName}
              disabled={isPending}
              {...register("amount", { valueAsNumber: true })}
            />
          </FormField>

          <FormField
            label="Expense Date"
            htmlFor="expense-date"
            error={errors.expenseDate?.message}
          >
            <input
              id="expense-date"
              type="date"
              className={inputClassName}
              disabled={isPending}
              {...register("expenseDate")}
            />
          </FormField>
        </div>

        <FormField
          label="Description (Optional)"
          htmlFor="expense-description"
          error={errors.description?.message}
        >
          <textarea
            id="expense-description"
            rows={3}
            placeholder="Add any notes about this expense..."
            className={inputClassName}
            disabled={isPending}
            {...register("description")}
          />
        </FormField>

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
            {isEditing ? "Save Changes" : "Add Expense"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
