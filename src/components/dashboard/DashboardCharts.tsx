"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { paisaToTaka } from "@/lib/currency";
import type { DashboardSummaryMetrics } from "@/types/dashboard";
import type { Expense } from "@/types/expense";
import type { Sale } from "@/types/sale";

function formatTakaTooltip(value: unknown) {
  const raw = Array.isArray(value) ? value[0] : value;
  const num = typeof raw === "number" ? raw : Number(raw ?? 0);
  return `৳ ${new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(num) ? num : 0)}`;
}

export function SalesOverviewChart({
  summary,
  recentSales,
}: {
  summary: DashboardSummaryMetrics;
  recentSales: Sale[];
}) {
  const hasSales = summary.totalSales > 0 || recentSales.length > 0;

  const collectionData = [
    { name: "Paid", value: paisaToTaka(summary.totalPaid), color: "#10b981" },
    { name: "Due", value: paisaToTaka(summary.totalDue), color: "#f59e0b" },
  ].filter((item) => item.value > 0);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Sales Collection Overview
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Paid vs. due breakdown from current sales summary
        </p>
      </div>

      {!hasSales || collectionData.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          No sales recorded yet to visualize.
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={collectionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={88}
                paddingAngle={3}
              >
                {collectionData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => formatTakaTooltip(val)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export function ExpenseOverviewChart({
  recentExpenses,
}: {
  recentExpenses: Expense[];
}) {
  const grouped = new Map<string, number>();
  for (const exp of recentExpenses) {
    const label = exp.category?.name ?? "Uncategorized";
    grouped.set(label, (grouped.get(label) ?? 0) + paisaToTaka(exp.amount));
  }

  const chartData = Array.from(grouped.entries()).map(([category, amount]) => ({
    category,
    amount,
  }));

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Recent Expenses by Category
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Based on recent expense records returned by the API
        </p>
      </div>

      {chartData.length === 0 ? (
        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-slate-200 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
          No recent expenses available to chart.
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="category"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `৳${v}`}
              />
              <Tooltip formatter={(val) => formatTakaTooltip(val)} />
              <Bar dataKey="amount" name="Expense (৳)" fill="#f59e0b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export function FinancialComparisonChart({
  summary,
}: {
  summary: DashboardSummaryMetrics;
}) {
  const data = [
    { name: "Total Sales", amount: paisaToTaka(summary.totalSales), fill: "#4f46e5" },
    { name: "Expenses", amount: paisaToTaka(summary.totalExpenses), fill: "#f43f5e" },
    { name: "Gross Profit", amount: paisaToTaka(summary.grossProfit), fill: "#0ea5e9" },
    { name: "Net Profit", amount: paisaToTaka(summary.netProfit), fill: "#10b981" },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Financial Performance Summary
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Comparison of revenue, expenses, gross profit, and net profit (in Taka)
        </p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `৳${v}`}
            />
            <Tooltip formatter={(val) => formatTakaTooltip(val)} />
            <Bar dataKey="amount" name="Amount (৳)" radius={[6, 6, 0, 0]}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
