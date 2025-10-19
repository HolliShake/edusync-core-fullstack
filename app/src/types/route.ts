import type { UserRole } from '@/enums/role-enum';
import type React from 'react';

export interface Route {
  title: string;
  path: string;
  key: string;
  component?: React.ReactNode;
  icon?: React.ReactNode;
  index?: boolean;
  layout: 'dashboard' | 'default';
  sidebar?: boolean;
  children?: Route[];
  type?: 'menu' | 'label';
  roles?: UserRole[] | undefined;
}
