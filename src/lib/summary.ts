import type { Expense, ExpenseCategory, Sale } from '@/types';

export interface FinancialSummary {
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  totalOrders: number;
}

export interface ProductBreakdownRow {
  name: string;
  quantity: number;
  revenue: number;
}

export interface CategoryBreakdownRow {
  category: ExpenseCategory;
  amount: number;
}

export interface DailyBreakdownRow {
  date: string;
  orders: number;
  sales: number;
  expenses: number;
  profit: number;
}

export function summarize(sales: Sale[], expenses: Expense[]): FinancialSummary {
  const totalSales = sales.reduce((acc, sale) => acc + sale.total, 0);
  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
  return {
    totalSales,
    totalExpenses,
    netProfit: totalSales - totalExpenses,
    totalOrders: sales.length,
  };
}

export function productBreakdown(sales: Sale[]): ProductBreakdownRow[] {
  const map = new Map<string, ProductBreakdownRow>();
  for (const sale of sales) {
    const row = map.get(sale.productName) ?? { name: sale.productName, quantity: 0, revenue: 0 };
    row.quantity += sale.quantity;
    row.revenue += sale.total;
    map.set(sale.productName, row);
  }
  return [...map.values()].sort((a, b) => b.revenue - a.revenue);
}

export function categoryBreakdown(expenses: Expense[]): CategoryBreakdownRow[] {
  const map = new Map<ExpenseCategory, number>();
  for (const expense of expenses) {
    map.set(expense.category, (map.get(expense.category) ?? 0) + expense.amount);
  }
  return [...map.entries()]
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function dailyBreakdown(sales: Sale[], expenses: Expense[]): DailyBreakdownRow[] {
  const map = new Map<string, DailyBreakdownRow>();
  const getRow = (date: string) => {
    const existing = map.get(date);
    if (existing) return existing;
    const row = { date, orders: 0, sales: 0, expenses: 0, profit: 0 };
    map.set(date, row);
    return row;
  };
  for (const sale of sales) {
    const row = getRow(sale.date);
    row.orders += 1;
    row.sales += sale.total;
  }
  for (const expense of expenses) {
    getRow(expense.date).expenses += expense.amount;
  }
  return [...map.values()]
    .map((row) => ({ ...row, profit: row.sales - row.expenses }))
    .sort((a, b) => b.date.localeCompare(a.date));
}
