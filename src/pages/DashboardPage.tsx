import { useMemo } from 'react';
import { Receipt } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import SummaryCards from '@/components/ui/SummaryCards';
import { cardClass, tableCellClass, tableHeadClass } from '@/lib/styles';
import { summarize } from '@/lib/summary';
import { formatDateLabel, formatPKR, formatWeekday, shiftDays, todayKey } from '@/lib/utils';
import type { Expense, Sale } from '@/types';

interface DashboardPageProps {
  sales: Sale[];
  expenses: Expense[];
}

export default function DashboardPage({ sales, expenses }: DashboardPageProps) {
  const today = todayKey();
  const summary = useMemo(() => summarize(sales, expenses), [sales, expenses]);

  const weeklySales = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, index) => shiftDays(today, index - 6));
    return days.map((date) => ({
      date,
      total: sales.filter((sale) => sale.date === date).reduce((acc, sale) => acc + sale.total, 0),
    }));
  }, [sales, today]);

  const maxDailySales = Math.max(...weeklySales.map((day) => day.total), 1);
  const todaysSales = weeklySales[weeklySales.length - 1]?.total ?? 0;

  const recentSales = useMemo(
    () => [...sales].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [sales],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Overview of your restaurant. {formatDateLabel(today)}</p>
      </div>

      <SummaryCards summary={summary} hint="All time" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className={`${cardClass} p-5 sm:p-6 lg:col-span-2`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-zinc-900">Last 7 days</h2>
              <p className="mt-1 text-sm text-zinc-500">Daily sales in Rs.</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Today</p>
              <p className="text-lg font-bold text-orange-600">{formatPKR(todaysSales)}</p>
            </div>
          </div>

          <div className="mt-8 flex h-48 items-end gap-2 sm:gap-4">
            {weeklySales.map((day) => {
              const heightPercent = day.total > 0 ? Math.max((day.total / maxDailySales) * 100, 4) : 0;
              const isToday = day.date === today;
              return (
                <div key={day.date} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-[10px] font-medium text-zinc-500 sm:text-xs">
                    {day.total > 0 ? formatPKR(day.total) : ''}
                  </span>
                  <div
                    className={`w-full max-w-[56px] rounded-t-lg transition-all duration-500 ${
                      isToday ? 'bg-orange-500' : 'bg-zinc-300 hover:bg-zinc-400'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                    title={`${formatDateLabel(day.date)}: ${formatPKR(day.total)}`}
                  />
                  <span className={`text-xs ${isToday ? 'font-semibold text-orange-600' : 'text-zinc-500'}`}>
                    {formatWeekday(day.date)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`${cardClass} flex flex-col overflow-hidden`}>
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-base font-semibold text-zinc-900">Recent sales</h2>
          </div>
          {recentSales.length === 0 ? (
            <EmptyState icon={Receipt} title="No sales yet" message="Recorded sales will appear here." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-zinc-50">
                  <tr>
                    <th className={tableHeadClass}>Product</th>
                    <th className={`${tableHeadClass} text-right`}>Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {recentSales.map((sale) => (
                    <tr key={sale.id}>
                      <td className={tableCellClass}>
                        <p className="font-medium text-zinc-900">{sale.productName}</p>
                        <p className="text-xs text-zinc-500">
                          {sale.quantity} x {formatDateLabel(sale.date)}
                        </p>
                      </td>
                      <td className={`${tableCellClass} text-right font-semibold text-zinc-900`}>
                        {formatPKR(sale.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
