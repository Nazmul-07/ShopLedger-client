import type { Category } from "./category";

export interface Expense {
  id: string;
  categoryId: string;
  title: string;
  amount: number; // stored in paisa
  description?: string | null;
  expenseDate: string;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface CreateExpenseInput {
  categoryId: string;
  title: string;
  amount: number; // integer paisa
  description?: string;
  expenseDate?: string;
}

export interface UpdateExpenseInput {
  categoryId?: string;
  title?: string;
  amount?: number; // integer paisa
  description?: string;
  expenseDate?: string;
}
