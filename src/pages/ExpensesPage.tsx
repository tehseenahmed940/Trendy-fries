import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2, Wallet } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import Modal from '@/components/ui/Modal';
import ExpenseForm from '@/components/forms/ExpenseForm';
import type { ExpenseInput } from '@/hooks/useRestaurantData';
import { cardClass, iconButtonClass, inputClass, primaryButtonClass, tableCellClass, tableHeadClass } from '@/lib/styles';
import { formatDateLabel, formatPKR, todayKey } from '@/lib/utils';
import { EXPENSE_CATEGORIES, type Expense, type ExpenseCategory } from '@/types';

interface ExpensesPageProps {
  expenses: Expense[];
  onSave: (id: string | null, input: ExpenseInput) => void;
  onDelete: (id: string) => void;
}

export default function ExpensesPage({ expenses, onSave, onDelete }: ExpensesPageProps) {
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | ''>('');
  const [dateFilter, setDateFilter] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const visibleExpenses = useMemo(
    () =>
      expenses
        .filter((expense) => !categoryFilter || expense.category === categoryFilter)
        .filter((expense) => !dateFilter || expense.date === dateFilter)
        .sort((a, b) => b.date.localeCompare(a.date)),
    [expenses, categoryFilter, dateFilter],
  );

  const visibleTotal = visibleExpenses.reduce((acc, expense) => acc + expense.amount, 0);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (expense: Expense) => {
    setEditing(expense);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSave = (input: ExpenseInput) => {
    onSave(editing?.id ?? null, input);
    closeForm();
  };

  const handleDelete = (expense: Expense) => {
    if (window.confirm(`Delete this ${expense.category} expense of ${formatPKR(expense.amount)}?`)) {
      onDelete(expense.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Expenses</h1>
          <p className="mt-1 text-sm text-zinc-500">Track what you spend to run the restaurant.</p>
        </div>
        <button type="button" onClick={openNew} className={primaryButtonClass}>
          <Plus size={18} />
          Add expense
        </button>
      </div>

      <div className={`${cardClass} overflow-hidden`}>
        <div className="grid grid-cols-1 gap-3 border-b border-zinc-200 p-4 sm:grid-cols-2">
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value as ExpenseCategory | '')}
            className={inputClass}
            aria-label="Filter expenses by category"
          >
            <option value="">All categories</option>
            {EXPENSE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className={inputClass}
            aria-label="Filter expenses by date"
          />
        </div>

        {expenses.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No expenses recorded yet"
            message="Tap Add expense to log ingredients, rent, bills and more."
          />
        ) : visibleExpenses.length === 0 ? (
          <EmptyState icon={Wallet} title="No matching expenses" message="Try a different category or date." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[420px]">
              <thead className="bg-zinc-50">
                <tr>
                  <th className={tableHeadClass}>Date</th>
                  <th className={tableHeadClass}>Category</th>
                  <th className={`${tableHeadClass} text-right`}>Amount</th>
                  <th className={`${tableHeadClass} text-right`}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {visibleExpenses.map((expense) => (
                  <tr key={expense.id} className="transition hover:bg-orange-50/50">
                    <td className={tableCellClass}>{formatDateLabel(expense.date)}</td>
                    <td className={tableCellClass}>
                      <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                        {expense.category}
                      </span>
                    </td>
                    <td className={`${tableCellClass} text-right font-semibold text-zinc-900`}>
                      {formatPKR(expense.amount)}
                    </td>
                    <td className={tableCellClass}>
                      <div className="flex justify-end gap-1">
                        <button type="button" onClick={() => openEdit(expense)} className={iconButtonClass} aria-label="Edit expense">
                          <Pencil size={16} />
                        </button>
                        <button type="button" onClick={() => handleDelete(expense)} className={`${iconButtonClass} hover:text-red-600`} aria-label="Delete expense">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-zinc-50">
                <tr>
                  <td className={`${tableCellClass} font-semibold`} colSpan={2}>
                    {visibleExpenses.length} {visibleExpenses.length === 1 ? 'expense' : 'expenses'} shown
                  </td>
                  <td className={`${tableCellClass} text-right font-bold text-red-600`}>{formatPKR(visibleTotal)}</td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {formOpen && (
        <Modal title={editing ? 'Edit expense' : 'Add expense'} onClose={closeForm}>
          <ExpenseForm
            key={editing?.id ?? 'new'}
            initial={editing}
            defaultDate={todayKey()}
            onSave={handleSave}
            onCancel={closeForm}
          />
        </Modal>
      )}
    </div>
  );
}
