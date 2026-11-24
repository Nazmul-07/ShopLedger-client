import type { PaymentStatus } from "@/types/sale";

export const LOW_STOCK_THRESHOLD = 10;

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function getPaymentStatus(
  paidAmount: number,
  totalAmount: number
): PaymentStatus {
  if (paidAmount <= 0) return "UNPAID";
  if (paidAmount >= totalAmount) return "PAID";
  return "PARTIAL";
}

export function isLowStock(stock: number): boolean {
  return stock > 0 && stock <= LOW_STOCK_THRESHOLD;
}

export function isOutOfStock(stock: number): boolean {
  return stock <= 0;
}
