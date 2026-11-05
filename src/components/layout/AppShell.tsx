import { useState, type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import { NAV_ITEMS } from '@/lib/navigation';
import { iconButtonClass } from '@/lib/styles';
import type { PageId } from '@/types';

interface AppShellProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  children: ReactNode;
}

export default function AppShell({ activePage, onNavigate, children }: AppShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const currentLabel = NAV_ITEMS.find((item) => item.id === activePage)?.label;

  const handleNavigate = (page: PageId) => {
    onNavigate(page);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-zinc-100">
      <Sidebar activePage={activePage} open={menuOpen} onNavigate={handleNavigate} />

      {menuOpen && (
        <div
          className="fixed inset-0 z-30 bg-zinc-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className={iconButtonClass}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
          <span className="font-semibold text-zinc-900">{currentLabel}</span>
        </header>

        <main className="mx-auto w-full max-w-6xl p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
