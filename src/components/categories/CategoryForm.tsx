"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormField, inputClassName } from "@/components/shared/FormField";
import { Modal } from "@/components/shared/Modal";
import { useCreateCategory, useUpdateCategory } from "@/hooks/useCategories";
import type { Category } from "@/types/category";
import {
  categorySchema,
  type CategoryFormValues,
} from "@/validations/category.validation";

interface CategoryFormProps {
  open: boolean;
  onClose: () => void;
  category?: Category | null;
}

export function CategoryForm({ open, onClose, category }: CategoryFormProps) {
  const isEditing = Boolean(category);
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const isPending = createMutation.isPending || updateMutation.isPending;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      type: "PRODUCT",
      isActive: true,
    },
  });

  useEffect(() => {
    if (open) {
      if (category) {
        reset({
          name: category.name,
          type: category.type,
          isActive: category.isActive,
        });
      } else {
        reset({
          name: "",
          type: "PRODUCT",
          isActive: true,
        });
      }
    }
  }, [open, category, reset]);

  const onSubmit = async (values: CategoryFormValues) => {
    if (isEditing && category) {
      await updateMutation.mutateAsync({
        id: category.id,
        payload: values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit Category" : "Add Category"}
      description={
        isEditing
          ? "Update category name, type, or active status."
          : "Create a category for products, expenses, or both."
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Category Name"
          htmlFor="category-name"
          required
          error={errors.name?.message}
        >
          <input
            id="category-name"
            type="text"
            placeholder="e.g. Electronics, Utilities"
            className={inputClassName}
            disabled={isPending}
            {...register("name")}
          />
        </FormField>

        <FormField
          label="Category Type"
          htmlFor="category-type"
          required
          error={errors.type?.message}
          hint="Determines whether this category appears in product or expense forms."
        >
          <select
            id="category-type"
            className={inputClassName}
            disabled={isPending}
            {...register("type")}
          >
            <option value="PRODUCT">Product</option>
            <option value="EXPENSE">Expense</option>
            <option value="BOTH">Both (Product & Expense)</option>
          </select>
        </FormField>

        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 dark:border-slate-700 dark:bg-slate-800/50">
          <div>
            <label
              htmlFor="category-active"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Active Status
            </label>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Inactive categories cannot be selected for new products or expenses.
            </p>
          </div>
          <input
            id="category-active"
            type="checkbox"
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            disabled={isPending}
            {...register("isActive")}
          />
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
            disabled={isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isEditing ? "Save Changes" : "Create Category"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
