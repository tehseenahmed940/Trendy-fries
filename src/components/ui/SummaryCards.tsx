import { Banknote, Receipt, TrendingDown, TrendingUp } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import type { FinancialSummary } from '@/lib/summary';
import { formatPKR } from '@/lib/utils';

interface SummaryCardsProps {
  summary: FinancialSummary;
  hint: string;
}

export default function SummaryCards({ summary, hint }: SummaryCardsProps) {
  const profitPositive = summary.netProfit >= 0;
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total Sales"
        value={formatPKR(summary.totalSales)}
        hint={hint}
        icon={Banknote}
        tone="orange"
      />
      <StatCard
        label="Total Expenses"
        value={formatPKR(summary.totalExpenses)}
        hint={hint}
        icon={TrendingDown}
        tone="red"
      />
      <StatCard
        label="Net Profit"
        value={formatPKR(summary.netProfit)}
        hint={profitPositive ? 'Sales minus expenses' : 'Expenses exceed sales'}
        icon={TrendingUp}
        tone={profitPositive ? 'emerald' : 'red'}
      />
      <StatCard
        label="Total Orders"
        value={String(summary.totalOrders)}
        hint={hint}
        icon={Receipt}
        tone="zinc"
      />
    </div>
  );
}
