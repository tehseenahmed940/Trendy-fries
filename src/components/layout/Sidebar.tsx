import { NAV_ITEMS } from '@/lib/navigation';
import type { PageId } from '@/types';
import { Flame } from 'lucide-react';

interface SidebarProps {
  activePage: PageId;
  open: boolean;
  onNavigate: (page: PageId) => void;
}

export default function Sidebar({ activePage, open, onNavigate }: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-zinc-900 text-zinc-300 transition-transform duration-300 ease-out lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">
          <Flame size={22} />
        </div>
        <div>
          <p className="text-base font-bold leading-tight text-white">Trendy Fries</p>
          <p className="text-xs text-zinc-400">Manager</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const active = item.id === activePage;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              aria-current={active ? 'page' : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="px-6 py-5 text-xs text-zinc-500">Your data is saved on this device</div>
    </aside>
  );
}
