import type { Metadata } from "next";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { AppProviders } from "@/components/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "ShopLedger — Shop Daily Accounting & Inventory",
  description:
    "Manage products, inventory, customer sales, daily expenses, and profit summaries in one SaaS dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <AppProviders>
          <DashboardLayout>{children}</DashboardLayout>
        </AppProviders>
      </body>
    </html>
  );
}
