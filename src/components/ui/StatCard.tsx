import type { LucideIcon } from 'lucide-react';
import { cardClass } from '@/lib/styles';

export type StatTone = 'orange' | 'emerald' | 'red' | 'zinc';

const toneClasses: Record<StatTone, string> = {
  orange: 'bg-orange-100 text-orange-600',
  emerald: 'bg-emerald-100 text-emerald-700',
  red: 'bg-red-100 text-red-600',
  zinc: 'bg-zinc-200 text-zinc-700',
};

interface StatCardProps {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
  tone: StatTone;
}

export default function StatCard({ label, value, hint, icon: Icon, tone }: StatCardProps) {
  return (
    <div className={`${cardClass} p-5 transition hover:-translate-y-0.5 hover:shadow-md`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="mt-2 truncate text-2xl font-bold tracking-tight text-zinc-900">{value}</p>
          <p className="mt-1 text-xs text-zinc-500">{hint}</p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}
