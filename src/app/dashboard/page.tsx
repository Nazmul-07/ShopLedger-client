"use client";

import {
  AlertCircle,
  Banknote,
  FolderKanban,
  Package,
  Plus,
  Receipt,
  ShoppingBag,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import {
  ExpenseOverviewChart,
  FinancialComparisonChart,
  SalesOverviewChart,
} from "@/components/dashboard/DashboardCharts";
import { RecentExpenses, RecentSales } from "@/components/dashboard/RecentTables";
import { SummaryCard } from "@/components/dashboard/SummaryCard";
import { ErrorState } from "@/components/shared/ErrorState";
import { DashboardLoadingState } from "@/components/shared/LoadingState";
import { PageHeader } from "@/components/shared/PageHeader";
import { useDashboard } from "@/hooks/useDashboard";
import { getApiErrorMessage } from "@/lib/axios";
import { formatCurrency } from "@/lib/currency";

export default function DashboardPage() {
  const { data, isLoading, isError, error, refetch } = useDashboard();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your shop inventory, sales collection, expenses, and profit."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/sales?new=1"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-sm font-medium text-white shadow-xs transition hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4" />
              Create Sale
            </Link>
            <Link
              href="/products?new=1"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Package className="h-4 w-4" />
              Add Product
            </Link>
            <Link
              href="/expenses?new=1"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <Receipt className="h-4 w-4" />
              Add Expense
            </Link>
            <Link
              href="/categories?new=1"
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              <FolderKanban className="h-4 w-4" />
              Add Category
            </Link>
          </div>
        }
      />

      {isLoading ? (
        <DashboardLoadingState />
      ) : isError ? (
        <ErrorState
          message={getApiErrorMessage(error, "Failed to load dashboard summary.")}
          onRetry={() => refetch()}
        />
      ) : data ? (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard
              title="Total Sales"
              value={formatCurrency(data.summary.totalSales)}
              icon={ShoppingBag}
              tone="indigo"
            />
            <SummaryCard
              title="Total Paid"
              value={formatCurrency(data.summary.totalPaid)}
              icon={Banknote}
              tone="emerald"
            />
            <SummaryCard
              title="Total Due"
              value={formatCurrency(data.summary.totalDue)}
              icon={AlertCircle}
              tone="amber"
            />
            <SummaryCard
              title="Total Expenses"
              value={formatCurrency(data.summary.totalExpenses)}
              icon={Receipt}
              tone="rose"
            />
            <SummaryCard
              title="Gross Profit"
              value={formatCurrency(data.summary.grossProfit)}
              icon={TrendingUp}
              tone="sky"
            />
            <SummaryCard
              title="Net Profit"
              value={formatCurrency(data.summary.netProfit)}
              icon={Wallet}
              tone={data.summary.netProfit >= 0 ? "emerald" : "rose"}
            />
            <SummaryCard
              title="Total Products"
              value={String(data.summary.totalProducts)}
              subtitle="Active inventory items"
              icon={Package}
              tone="slate"
            />
            <SummaryCard
              title="Total Categories"
              value={String(data.summary.totalCategories)}
              subtitle="Product & expense groups"
              icon={FolderKanban}
              tone="slate"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <SalesOverviewChart
              summary={data.summary}
              recentSales={data.recentSales}
            />
            <ExpenseOverviewChart recentExpenses={data.recentExpenses} />
          </div>

          <FinancialComparisonChart summary={data.summary} />

          {/* Recent Tables */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <RecentSales sales={data.recentSales} />
            <RecentExpenses expenses={data.recentExpenses} />
          </div>
        </>
      ) : null}
    </div>
  );
}
