# ShopLedger Client

**ShopLedger** is a Shop Daily Accounting and Inventory Management frontend built with Next.js (App Router), TypeScript, Tailwind CSS, TanStack Query, React Hook Form, Zod, and Recharts.

It integrates with the deployed ShopLedger backend API to help small shop owners manage categories, products, inventory, customer sales, payment statuses, daily expenses, and profit summaries.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4 (light mode default + dark mode toggle)
- **Data Fetching & Caching:** TanStack React Query + Axios
- **Forms & Validation:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons & Notifications:** Lucide React + Sonner

---

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=https://shop-ledger-server.vercel.app/api/v1
```

> **Note:** Browser API requests are routed through the Next.js rewrite `/api/proxy/*` (configured in `next.config.ts`) to avoid cross-origin (CORS) blocks when calling the deployed backend from `localhost`.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint checks |
| `npx tsc --noEmit` | Run TypeScript typechecking |

---

## Modules & Routes

- **`/` & `/dashboard`** — Financial overview with KPI cards (Total Sales, Total Paid, Total Due, Total Expenses, Gross Profit, Net Profit, Total Products, Total Categories), Recharts visualizations, quick action links, and recent sales/expenses tables.
- **`/categories`** — Create, edit, activate/deactivate, search, filter by type (`PRODUCT`, `EXPENSE`, `BOTH`) and status, and delete categories.
- **`/products`** — Manage inventory items, cost/selling prices, profit per unit, low-stock/out-of-stock indicators, category filtering, and product detail views.
- **`/sales`** — Record, edit, view, and delete customer sales with live total/due calculations, payment status badges (`PAID`, `PARTIAL`, `UNPAID`), stock validation, and server-managed inventory updates.
- **`/expenses`** — Record, edit, view, and delete daily shop expenses filtered by title, category, and date.

---

## Currency & Data Conventions

- The backend stores all monetary amounts as integer **paisa** (`100 paisa = ৳ 1.00`).
- `src/lib/currency.ts` converts stored paisa to Taka (`paisaToTaka`, `formatCurrency`) for display and converts user-entered Taka amounts to integer paisa (`takaToPaisa`) before sending API requests.
- Non-monetary quantities (`stock`, `quantity`) are passed as whole integers without scaling.

---

## Project Structure

```text
src/
├── app/                  # App Router pages (dashboard, categories, products, sales, expenses)
├── components/
│   ├── categories/       # CategoryForm, CategoryTable
│   ├── dashboard/        # SummaryCard, DashboardCharts, RecentTables
│   ├── expenses/         # ExpenseForm, ExpenseTable
│   ├── layout/           # DashboardLayout, Sidebar, MobileSidebar, Header
│   ├── products/         # ProductForm, ProductTable
│   ├── providers/        # AppProviders (React Query + Sonner Toaster)
│   ├── sales/            # SaleForm, SaleTable
│   └── shared/           # Modal, ConfirmDialog, FormField, StatusBadge, loading/empty/error states
├── hooks/                # TanStack Query hooks with cross-module cache invalidation
├── lib/                  # Axios client, currency, date, and utility helpers
├── services/             # API service modules (category, product, sale, expense, dashboard)
├── types/                # TypeScript interfaces for API payloads and responses
└── validations/          # Zod schemas for all forms
```
