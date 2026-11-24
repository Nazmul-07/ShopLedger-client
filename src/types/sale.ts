import type { Product } from "./product";

export type PaymentStatus = "PAID" | "PARTIAL" | "UNPAID";

export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number; // stored in paisa
  costPrice: number; // historical snapshot in paisa
  totalAmount: number; // stored in paisa
  paidAmount: number; // stored in paisa
  soldAt: string;
  createdAt: string;
  updatedAt?: string;
  updateAt?: string; // backend returns updateAt in some responses
  product?: Product;
}

export interface CreateSaleInput {
  productId: string;
  quantity: number;
  unitPrice: number; // integer paisa
  paidAmount: number; // integer paisa
  soldAt?: string;
}

export interface UpdateSaleInput {
  productId?: string;
  quantity?: number;
  unitPrice?: number; // integer paisa
  paidAmount?: number; // integer paisa
  soldAt?: string;
}
