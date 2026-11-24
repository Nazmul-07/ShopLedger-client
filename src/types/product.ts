import type { Category } from "./category";

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  costPrice: number; // stored in paisa
  sellingPrice: number; // stored in paisa
  stock: number;
  createdAt: string;
  updatedAt: string;
  category?: Category;
}

export interface CreateProductInput {
  name: string;
  categoryId: string;
  costPrice: number; // integer paisa
  sellingPrice: number; // integer paisa
  stock: number;
}

export interface UpdateProductInput {
  name?: string;
  categoryId?: string;
  costPrice?: number; // integer paisa
  sellingPrice?: number; // integer paisa
  stock?: number;
}
