import { apiClient, unwrapArray, unwrapData } from "@/lib/axios";
import type {
  CreateProductInput,
  Product,
  UpdateProductInput,
} from "@/types/product";

export const productService = {
  async getAll(): Promise<Product[]> {
    const response = await apiClient.get("/products");
    return unwrapArray<Product>(response.data);
  },

  async getById(id: string): Promise<Product> {
    const response = await apiClient.get(`/products/${id}`);
    return unwrapData<Product>(response.data);
  },

  async create(payload: CreateProductInput): Promise<Product> {
    const response = await apiClient.post("/products", payload);
    return unwrapData<Product>(response.data);
  },

  async update(id: string, payload: UpdateProductInput): Promise<Product> {
    const response = await apiClient.patch(`/products/${id}`, payload);
    return unwrapData<Product>(response.data);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/products/${id}`);
  },
};
