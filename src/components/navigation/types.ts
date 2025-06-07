
import { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  title: string;
  href?: string;
  icon: LucideIcon;
  roles?: string[];
}

export interface NavigationMenu extends MenuItem {
  children?: MenuItem[];
}
