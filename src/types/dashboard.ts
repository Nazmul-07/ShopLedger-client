import type { Expense } from "./expense";
import type { Sale } from "./sale";

export interface DashboardSummaryMetrics {
  totalProducts: number;
  totalCategories: number;
  totalSales: number; // paisa
  totalPaid: number; // paisa
  totalDue: number; // paisa
  totalExpenses: number; // paisa
  grossProfit: number; // paisa
  netProfit: number; // paisa
}

export interface DashboardSummary {
  summary: DashboardSummaryMetrics;
  recentSales: Sale[];
  recentExpenses: Expense[];
}
