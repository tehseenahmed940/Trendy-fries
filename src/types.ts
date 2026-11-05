export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface Sale {
  id: string;
  date: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export const EXPENSE_CATEGORIES = [
  'Ingredients',
  'Rent',
  'Utilities',
  'Salaries',
  'Packaging',
  'Marketing',
  'Other',
] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface Expense {
  id: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
}

export type PageId = 'dashboard' | 'sales' | 'expenses' | 'products' | 'reports';
