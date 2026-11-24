import { apiClient, unwrapArray, unwrapData } from "@/lib/axios";
import type { CreateSaleInput, Sale, UpdateSaleInput } from "@/types/sale";

export const saleService = {
  async getAll(): Promise<Sale[]> {
    const response = await apiClient.get("/sales");
    return unwrapArray<Sale>(response.data);
  },

  async getById(id: string): Promise<Sale> {
    const response = await apiClient.get(`/sales/${id}`);
    return unwrapData<Sale>(response.data);
  },

  async create(payload: CreateSaleInput): Promise<Sale> {
    const response = await apiClient.post("/sales", payload);
    return unwrapData<Sale>(response.data);
  },

  async update(id: string, payload: UpdateSaleInput): Promise<Sale> {
    const response = await apiClient.patch(`/sales/${id}`, payload);
    return unwrapData<Sale>(response.data);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/sales/${id}`);
  },
};
