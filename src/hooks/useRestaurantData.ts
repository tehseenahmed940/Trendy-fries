import { useLocalStorage } from '@/hooks/useLocalStorage';
import { SAMPLE_PRODUCTS } from '@/lib/sampleData';
import { generateId } from '@/lib/utils';
import type { Expense, ExpenseCategory, Product, Sale } from '@/types';

export interface ProductInput {
  name: string;
  price: number;
}

export interface SaleInput {
  date: string;
  product: Product;
  quantity: number;
}

export interface ExpenseInput {
  date: string;
  category: ExpenseCategory;
  amount: number;
}

export function useRestaurantData() {
  const [products, setProducts] = useLocalStorage<Product[]>('trendy-fries.products', SAMPLE_PRODUCTS);
  const [sales, setSales] = useLocalStorage<Sale[]>('trendy-fries.sales', []);
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('trendy-fries.expenses', []);

  const saveProduct = (id: string | null, input: ProductInput) => {
    setProducts((prev) =>
      id
        ? prev.map((product) => (product.id === id ? { ...product, ...input } : product))
        : [...prev, { id: generateId(), ...input }],
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((product) => product.id !== id));
  };

  const saveSale = (id: string | null, input: SaleInput) => {
    const record = {
      date: input.date,
      productId: input.product.id,
      productName: input.product.name,
      quantity: input.quantity,
      unitPrice: input.product.price,
      total: input.product.price * input.quantity,
    };
    setSales((prev) =>
      id
        ? prev.map((sale) => (sale.id === id ? { ...sale, ...record } : sale))
        : [{ id: generateId(), ...record }, ...prev],
    );
  };

  const deleteSale = (id: string) => {
    setSales((prev) => prev.filter((sale) => sale.id !== id));
  };

  const saveExpense = (id: string | null, input: ExpenseInput) => {
    setExpenses((prev) =>
      id
        ? prev.map((expense) => (expense.id === id ? { ...expense, ...input } : expense))
        : [{ id: generateId(), ...input }, ...prev],
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  };

  return {
    products,
    sales,
    expenses,
    saveProduct,
    deleteProduct,
    saveSale,
    deleteSale,
    saveExpense,
    deleteExpense,
  };
}
