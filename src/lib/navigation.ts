import { BarChart3, LayoutDashboard, Package, ShoppingBag, Wallet, type LucideIcon } from 'lucide-react';
import type { PageId } from '@/types';

export interface NavItem {
  id: PageId;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'sales', label: 'Sales', icon: ShoppingBag },
  { id: 'expenses', label: 'Expenses', icon: Wallet },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
];
