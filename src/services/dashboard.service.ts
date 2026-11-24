import { apiClient, unwrapData } from "@/lib/axios";
import type { DashboardSummary } from "@/types/dashboard";

export const dashboardService = {
  async getSummary(): Promise<DashboardSummary> {
    const response = await apiClient.get("/dashboard/summary");
    return unwrapData<DashboardSummary>(response.data);
  },
};
