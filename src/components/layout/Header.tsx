"use client";

import { ChevronRight, Menu, Moon, Sun, UserCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "./Sidebar";

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("shopledger-theme");
    const shouldBeDark = saved === "dark";
    document.documentElement.classList.toggle("dark", shouldBeDark);
    const id = requestAnimationFrame(() => {
      setIsDark(shouldBeDark);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("shopledger-theme", next ? "dark" : "light");
  };

  const currentNav =
    NAV_ITEMS.find((item) => item.match(pathname)) ?? NAV_ITEMS[0];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6 dark:border-slate-800 dark:bg-slate-900/95">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          aria-label="Open menu"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-sm" aria-label="Breadcrumb">
          <Link
            href="/dashboard"
            className="font-medium text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
          >
            ShopLedger
          </Link>
          <ChevronRight className="h-4 w-4 text-slate-400" />
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            {currentNav.label}
          </span>
        </nav>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 dark:border-slate-700 dark:bg-slate-800/80">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-600 text-white">
            <UserCheck className="h-3.5 w-3.5" />
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-xs font-semibold leading-none text-slate-800 dark:text-slate-100">
              Shop Owner
            </p>
            <p className="mt-0.5 text-[11px] leading-none text-slate-500 dark:text-slate-400">
              Admin Workspace
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
