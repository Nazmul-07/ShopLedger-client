import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(80, "Category name must be 80 characters or fewer"),
  type: z.enum(["PRODUCT", "EXPENSE", "BOTH"], {
    message: "Please select a valid category type",
  }),
  isActive: z.boolean(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;
