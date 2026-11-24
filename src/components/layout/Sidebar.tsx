"use client";

import {
  FolderKanban,
  LayoutDashboard,
  Package,
  Receipt,
  ShoppingBag,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    match: (path: string) => path === "/" || path.startsWith("/dashboard"),
  },
  {
    label: "Categories",
    href: "/categories",
    icon: FolderKanban,
    match: (path: string) => path.startsWith("/categories"),
  },
  {
    label: "Products",
    href: "/products",
    icon: Package,
    match: (path: string) => path.startsWith("/products"),
  },
  {
    label: "Sales",
    href: "/sales",
    icon: ShoppingBag,
    match: (path: string) => path.startsWith("/sales"),
  },
  {
    label: "Expenses",
    href: "/expenses",
    icon: Receipt,
    match: (path: string) => path.startsWith("/expenses"),
  },
];

export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex h-16 items-center gap-3 border-b border-slate-200 px-5 dark:border-slate-800"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
          <Store className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
            ShopLedger
          </span>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Daily Accounting
          </span>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Main navigation">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Menu
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-slate-100"
              )}
            >
              <Icon
                className={cn(
                  "h-4.5 w-4.5 shrink-0",
                  active
                    ? "text-indigo-600 dark:text-indigo-400"
                    : "text-slate-400 dark:text-slate-500"
                )}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-200">
            ShopLedger SaaS
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
            Currency: BDT (৳ Taka)
          </p>
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:flex-col dark:border-slate-800 dark:bg-slate-900">
      <SidebarContent />
    </aside>
  );
}
