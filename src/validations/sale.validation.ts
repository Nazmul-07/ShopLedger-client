import { z } from "zod";

const isValidMoneyTaka = (val: number) =>
  Number.isFinite(val) && Number.isSafeInteger(Math.round(val * 100));

export const saleSchema = z
  .object({
    productId: z.string().min(1, "Please select a product"),
    quantity: z
      .number({ message: "Quantity must be a valid number" })
      .int("Quantity must be a whole number")
      .min(1, "Quantity must be at least 1"),
    unitPrice: z
      .number({ message: "Unit price must be a valid number" })
      .min(0, "Unit price cannot be negative")
      .refine(isValidMoneyTaka, "Unit price is too large or invalid"),
    paidAmount: z
      .number({ message: "Paid amount must be a valid number" })
      .min(0, "Paid amount cannot be negative")
      .refine(isValidMoneyTaka, "Paid amount is too large or invalid"),
    soldAt: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const totalPaisa = Math.round(data.quantity * Math.round(data.unitPrice * 100));
    const paidPaisa = Math.round(data.paidAmount * 100);
    if (paidPaisa > totalPaisa) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["paidAmount"],
        message: "Paid amount cannot exceed total amount",
      });
    }
  });

export type SaleFormValues = z.infer<typeof saleSchema>;
