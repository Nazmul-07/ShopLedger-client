import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/axios";
import { expenseService } from "@/services/expense.service";
import type { CreateExpenseInput, UpdateExpenseInput } from "@/types/expense";

export const EXPENSE_KEYS = {
  all: ["expenses"] as const,
};

export function useExpenses() {
  return useQuery({
    queryKey: EXPENSE_KEYS.all,
    queryFn: expenseService.getAll,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExpenseInput) => expenseService.create(payload),
    onSuccess: () => {
      toast.success("Expense added successfully");
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to add expense"));
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateExpenseInput }) =>
      expenseService.update(id, payload),
    onSuccess: () => {
      toast.success("Expense updated successfully");
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to update expense"));
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => expenseService.remove(id),
    onSuccess: () => {
      toast.success("Expense deleted successfully");
      queryClient.invalidateQueries({ queryKey: EXPENSE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error, "Failed to delete expense"));
    },
  });
}
