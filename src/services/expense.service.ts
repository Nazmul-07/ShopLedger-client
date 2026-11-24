import { apiClient, unwrapArray, unwrapData } from "@/lib/axios";
import type {
  CreateExpenseInput,
  Expense,
  UpdateExpenseInput,
} from "@/types/expense";

export const expenseService = {
  async getAll(): Promise<Expense[]> {
    const response = await apiClient.get("/expenses");
    return unwrapArray<Expense>(response.data);
  },

  async getById(id: string): Promise<Expense> {
    const response = await apiClient.get(`/expenses/${id}`);
    return unwrapData<Expense>(response.data);
  },

  async create(payload: CreateExpenseInput): Promise<Expense> {
    const response = await apiClient.post("/expenses", payload);
    return unwrapData<Expense>(response.data);
  },

  async update(id: string, payload: UpdateExpenseInput): Promise<Expense> {
    const response = await apiClient.patch(`/expenses/${id}`, payload);
    return unwrapData<Expense>(response.data);
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/expenses/${id}`);
  },
};
