import { useMemo, useState } from 'react';
import { CalendarDays, FileBarChart } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import SummaryCards from '@/components/ui/SummaryCards';
import { cardClass, inputClass, labelClass, tableCellClass, tableHeadClass } from '@/lib/styles';
import {
  categoryBreakdown,
  dailyBreakdown,
  productBreakdown,
  summarize,
} from '@/lib/summary';
import { formatDateLabel, formatMonthLabel, formatPKR, todayKey } from '@/lib/utils';
import type { Expense, Sale } from '@/types';

interface ReportsPageProps {
  sales: Sale[];
  expenses: Expense[];
}

type ReportMode = 'daily' | 'monthly';

const modeTabClass = (active: boolean) =>
  `rounded-lg px-4 py-2 text-sm font-semibold transition ${
    active ? 'bg-white text-orange-600 shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
  }`;

export default function ReportsPage({ sales, expenses }: ReportsPageProps) {
  const [mode, setMode] = useState<ReportMode>('daily');
  const [selectedDate, setSelectedDate] = useState(todayKey());
  const [selectedMonth, setSelectedMonth] = useState(todayKey().slice(0, 7));

  const periodSales = useMemo(
    () => sales.filter((sale) => (mode === 'daily' ? sale.date === selectedDate : sale.date.startsWith(selectedMonth))),
    [sales, mode, selectedDate, selectedMonth],
  );

  const periodExpenses = useMemo(
    () =>
      expenses.filter((expense) =>
        mode === 'daily' ? expense.date === selectedDate : expense.date.startsWith(selectedMonth),
      ),
    [expenses, mode, selectedDate, selectedMonth],
  );

  const summary = useMemo(() => summarize(periodSales, periodExpenses), [periodSales, periodExpenses]);
  const products = useMemo(() => productBreakdown(periodSales), [periodSales]);
  const categories = useMemo(() => categoryBreakdown(periodExpenses), [periodExpenses]);
  const daily = useMemo(() => dailyBreakdown(periodSales, periodExpenses), [periodSales, periodExpenses]);

  const periodLabel = mode === 'daily' ? formatDateLabel(selectedDate) : formatMonthLabel(selectedMonth);
  const hasActivity = periodSales.length > 0 || periodExpenses.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Reports</h1>
          <p className="mt-1 text-sm text-zinc-500">Daily and monthly sales, expenses and profit.</p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="inline-flex rounded-xl bg-zinc-200/70 p-1" role="tablist" aria-label="Report type">
            <button type="button" role="tab" aria-selected={mode === 'daily'} className={modeTabClass(mode === 'daily')} onClick={() => setMode('daily')}>
              Daily
            </button>
            <button type="button" role="tab" aria-selected={mode === 'monthly'} className={modeTabClass(mode === 'monthly')} onClick={() => setMode('monthly')}>
              Monthly
            </button>
          </div>
          <div className="w-full sm:w-56">
            <label className={labelClass} htmlFor="report-period">
              {mode === 'daily' ? 'Select date' : 'Select month'}
            </label>
            {mode === 'daily' ? (
              <input
                id="report-period"
                type="date"
                className={inputClass}
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            ) : (
              <input
                id="report-period"
                type="month"
                className={inputClass}
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm font-medium text-zinc-600">
        <CalendarDays size={16} className="text-orange-500" />
        Showing {mode === 'daily' ? 'the day of' : 'the month of'} {periodLabel}
      </div>

      <SummaryCards summary={summary} hint={periodLabel} />

      {!hasActivity ? (
        <div className={cardClass}>
          <EmptyState
            icon={FileBarChart}
            title="Nothing recorded for this period"
            message="Pick another date or month, or record sales and expenses to see the report."
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className={`${cardClass} overflow-hidden`}>
            <div className="border-b border-zinc-200 px-5 py-4">
              <h2 className="text-base font-semibold text-zinc-900">Sales by product</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className={tableHeadClass}>Product</th>
                    <th className={`${tableHeadClass} text-right`}>Qty</th>
                    <th className={`${tableHeadClass} text-right`}>Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {products.length === 0 ? (
                    <tr>
                      <td className={tableCellClass} colSpan={3}>No sales in this period.</td>
                    </tr>
                  ) : (
                    products.map((row) => (
                      <tr key={row.name}>
                        <td className={`${tableCellClass} font-medium text-zinc-900`}>{row.name}</td>
                        <td className={`${tableCellClass} text-right`}>{row.quantity}</td>
                        <td className={`${tableCellClass} text-right font-semibold text-zinc-900`}>{formatPKR(row.revenue)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`${cardClass} overflow-hidden`}>
            <div className="border-b border-zinc-200 px-5 py-4">
              <h2 className="text-base font-semibold text-zinc-900">Expenses by category</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className={tableHeadClass}>Category</th>
                    <th className={`${tableHeadClass} text-right`}>Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {categories.length === 0 ? (
                    <tr>
                      <td className={tableCellClass} colSpan={2}>No expenses in this period.</td>
                    </tr>
                  ) : (
                    categories.map((row) => (
                      <tr key={row.category}>
                        <td className={`${tableCellClass} font-medium text-zinc-900`}>{row.category}</td>
                        <td className={`${tableCellClass} text-right font-semibold text-zinc-900`}>{formatPKR(row.amount)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {mode === 'monthly' && (
            <div className={`${cardClass} overflow-hidden lg:col-span-2`}>
              <div className="border-b border-zinc-200 px-5 py-4">
                <h2 className="text-base font-semibold text-zinc-900">Day by day</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px]">
                  <thead className="bg-zinc-50">
                    <tr>
                      <th className={tableHeadClass}>Date</th>
                      <th className={`${tableHeadClass} text-right`}>Orders</th>
                      <th className={`${tableHeadClass} text-right`}>Sales</th>
                      <th className={`${tableHeadClass} text-right`}>Expenses</th>
                      <th className={`${tableHeadClass} text-right`}>Profit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {daily.map((row) => (
                      <tr key={row.date} className="hover:bg-orange-50/50">
                        <td className={`${tableCellClass} font-medium text-zinc-900`}>{formatDateLabel(row.date)}</td>
                        <td className={`${tableCellClass} text-right`}>{row.orders}</td>
                        <td className={`${tableCellClass} text-right`}>{formatPKR(row.sales)}</td>
                        <td className={`${tableCellClass} text-right`}>{formatPKR(row.expenses)}</td>
                        <td className={`${tableCellClass} text-right font-semibold ${row.profit >= 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                          {formatPKR(row.profit)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
