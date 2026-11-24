import { apiClient, unwrapArray, unwrapData } from "@/lib/axios";
import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/types/category";

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const response = await apiClient.get("/categories");
    return unwrapArray<Category>(response.data);
  },

  async getById(id: string): Promise<Category> {
    const response = await apiClient.get(`/categories/${id}`);
    return unwrapData<Category>(response.data);
  },

  async create(payload: CreateCategoryInput): Promise<Category> {
    const response = await apiClient.post("/categories", payload);
    return unwrapData<Category>(response.data);
  },

  async update(id: string, payload: UpdateCategoryInput): Promise<Category> {
    const response = await apiClient.patch(`/categories/${id}`, payload);
    return unwrapData<Category>(response.data);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  },
};
