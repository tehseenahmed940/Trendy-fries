import { useState, type FormEvent } from 'react';
import FormActions from '@/components/forms/FormActions';
import type { ExpenseInput } from '@/hooks/useRestaurantData';
import { inputClass, labelClass } from '@/lib/styles';
import { EXPENSE_CATEGORIES, type Expense, type ExpenseCategory } from '@/types';

interface ExpenseFormProps {
  initial: Expense | null;
  defaultDate: string;
  onSave: (input: ExpenseInput) => void;
  onCancel: () => void;
}

export default function ExpenseForm({ initial, defaultDate, onSave, onCancel }: ExpenseFormProps) {
  const [date, setDate] = useState(initial?.date ?? defaultDate);
  const [category, setCategory] = useState<ExpenseCategory>(initial?.category ?? EXPENSE_CATEGORIES[0]);
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [error, setError] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amountValue = Number(amount);
    if (!date) {
      setError('Please choose a date.');
      return;
    }
    if (amount === '' || Number.isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter an amount greater than zero.');
      return;
    }
    onSave({ date, category, amount: amountValue });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className={labelClass} htmlFor="expense-date">
          Date
        </label>
        <input
          id="expense-date"
          type="date"
          className={inputClass}
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="expense-category">
          Category
        </label>
        <select
          id="expense-category"
          className={inputClass}
          value={category}
          onChange={(event) => setCategory(event.target.value as ExpenseCategory)}
        >
          {EXPENSE_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass} htmlFor="expense-amount">
          Amount (Rs.)
        </label>
        <input
          id="expense-amount"
          type="number"
          min="0"
          step="1"
          inputMode="decimal"
          className={inputClass}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="e.g. 5000"
        />
      </div>
      {error && <p className="text-sm font-medium text-red-600">{error}</p>}
      <FormActions submitLabel={initial ? 'Save changes' : 'Add expense'} onCancel={onCancel} />
    </form>
  );
}
