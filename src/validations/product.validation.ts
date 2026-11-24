import { z } from "zod";

const isValidMoneyTaka = (val: number) =>
  Number.isFinite(val) && Number.isSafeInteger(Math.round(val * 100));

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(120, "Product name must be 120 characters or fewer"),
  categoryId: z.string().min(1, "Please select a category"),
  costPrice: z
    .number({ message: "Cost price must be a valid number" })
    .min(0, "Cost price cannot be negative")
    .refine(isValidMoneyTaka, "Cost price is too large or invalid"),
  sellingPrice: z
    .number({ message: "Selling price must be a valid number" })
    .gt(0, "Selling price must be greater than zero")
    .refine(isValidMoneyTaka, "Selling price is too large or invalid"),
  stock: z
    .number({ message: "Stock must be a valid number" })
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
