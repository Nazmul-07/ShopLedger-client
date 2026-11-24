import { z } from "zod";

const isValidMoneyTaka = (val: number) =>
  Number.isFinite(val) && Number.isSafeInteger(Math.round(val * 100));

export const expenseSchema = z.object({
  categoryId: z.string().min(1, "Please select a category"),
  title: z
    .string()
    .trim()
    .min(1, "Expense title is required")
    .max(120, "Title must be 120 characters or fewer"),
  amount: z
    .number({ message: "Amount must be a valid number" })
    .gt(0, "Amount must be greater than zero")
    .refine(isValidMoneyTaka, "Amount is too large or invalid"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or fewer")
    .optional(),
  expenseDate: z.string().optional(),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;
