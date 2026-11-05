import { useMemo, useState } from 'react';
import { Pencil, ShoppingBag, Trash2, Plus } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import SaleForm from '@/components/forms/SaleForm';
import type { SaleInput } from '@/hooks/useRestaurantData';
import { cardClass, iconButtonClass, inputClass, primaryButtonClass, tableCellClass, tableHeadClass } from '@/lib/styles';
import { formatDateLabel, formatPKR, todayKey } from '@/lib/utils';
import type { Product, Sale } from '@/types';

interface SalesPageProps {
  sales: Sale[];
  products: Product[];
  onSave: (id: string | null, input: SaleInput) => void;
  onDelete: (id: string) => void;
}

export default function SalesPage({ sales, products, onSave, onDelete }: SalesPageProps) {
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Sale | null>(null);

  const visibleSales = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sales
      .filter((sale) => !dateFilter || sale.date === dateFilter)
      .filter((sale) => !query || sale.productName.toLowerCase().includes(query))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [sales, search, dateFilter]);

  const visibleTotal = visibleSales.reduce((acc, sale) => acc + sale.total, 0);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (sale: Sale) => {
    setEditing(sale);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSave = (input: SaleInput) => {
    onSave(editing?.id ?? null, input);
    closeForm();
  };

  const handleDelete = (sale: Sale) => {
    if (window.confirm(`Delete this sale of ${sale.productName}?`)) {
      onDelete(sale.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Sales</h1>
          <p className="mt-1 text-sm text-zinc-500">Record and review every order you sell.</p>
        </div>
        <button type="button" onClick={openNew} className={primaryButtonClass}>
          <Plus size={18} />
          Record sale
        </button>
      </div>

      <div className={`${cardClass} overflow-hidden`}>
        <div className="grid grid-cols-1 gap-3 border-b border-zinc-200 p-4 sm:grid-cols-[1fr_200px]">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by product name"
            className={inputClass}
            aria-label="Search sales by product"
          />
          <input
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className={inputClass}
            aria-label="Filter sales by date"
          />
        </div>

        {sales.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No sales recorded yet"
            message="Tap Record sale to add your first order."
          />
        ) : visibleSales.length === 0 ? (
          <EmptyState icon={ShoppingBag} title="No matching sales" message="Try a different search or date." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead className="bg-zinc-50">
                <tr>
                  <th className={tableHeadClass}>Date</th>
                  <th className={tableHeadClass}>Product</th>
                  <th className={`${tableHeadClass} text-right`}>Qty</th>
                  <th className={`${tableHeadClass} hidden text-right md:table-cell`}>Unit price</th>
                  <th className={`${tableHeadClass} text-right`}>Total</th>
                  <th className={`${tableHeadClass} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {visibleSales.map((sale) => (
                  <tr key={sale.id} className="transition hover:bg-orange-50/50">
                    <td className={tableCellClass}>{formatDateLabel(sale.date)}</td>
                    <td className={`${tableCellClass} font-medium text-zinc-900`}>{sale.productName}</td>
                    <td className={`${tableCellClass} text-right`}>{sale.quantity}</td>
                    <td className={`${tableCellClass} hidden text-right md:table-cell`}>
                      {formatPKR(sale.unitPrice)}
                    </td>
                    <td className={`${tableCellClass} text-right font-semibold text-zinc-900`}>
                      {formatPKR(sale.total)}
                    </td>
                    <td className={tableCellClass}>
                      <div className="flex justify-end gap-1">
                        <button type="button" onClick={() => openEdit(sale)} className={iconButtonClass} aria-label="Edit sale">
                          <Pencil size={16} />
                        </button>
                        <button type="button" onClick={() => handleDelete(sale)} className={`${iconButtonClass} hover:text-red-600`} aria-label="Delete sale">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-zinc-50">
                <tr>
                  <td className={`${tableCellClass} font-semibold`} colSpan={4}>
                    {visibleSales.length} {visibleSales.length === 1 ? 'sale' : 'sales'} shown
                  </td>
                  <td className={`${tableCellClass} text-right font-bold text-orange-600`}>{formatPKR(visibleTotal)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {formOpen && (
        <Modal title={editing ? 'Edit sale' : 'Record sale'} onClose={closeForm}>
          <SaleForm
            key={editing?.id ?? 'new'}
            initial={editing}
            products={products}
            defaultDate={todayKey()}
            onSave={handleSave}
            onCancel={closeForm}
          />
        </Modal>
      )}
    </div>
  );
}
