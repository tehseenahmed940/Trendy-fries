import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { useRestaurantData } from '@/hooks/useRestaurantData';
import DashboardPage from '@/pages/DashboardPage';
import ExpensesPage from '@/pages/ExpensesPage';
import ProductsPage from '@/pages/ProductsPage';
import ReportsPage from '@/pages/ReportsPage';
import SalesPage from '@/pages/SalesPage';
import type { PageId } from '@/types';

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard');
  const data = useRestaurantData();

  return (
    <AppShell activePage={page} onNavigate={setPage}>
      {page === 'dashboard' && <DashboardPage sales={data.sales} expenses={data.expenses} />}
      {page === 'sales' && (
        <SalesPage sales={data.sales} products={data.products} onSave={data.saveSale} onDelete={data.deleteSale} />
      )}
      {page === 'expenses' && (
        <ExpensesPage expenses={data.expenses} onSave={data.saveExpense} onDelete={data.deleteExpense} />
      )}
      {page === 'products' && (
        <ProductsPage products={data.products} onSave={data.saveProduct} onDelete={data.deleteProduct} />
      )}
      {page === 'reports' && <ReportsPage sales={data.sales} expenses={data.expenses} />}
    </AppShell>
  );
}
