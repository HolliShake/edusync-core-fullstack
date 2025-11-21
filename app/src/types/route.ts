import { UserRoleEnum } from '@rest/models';
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
  roles?: UserRoleEnum[] | undefined;
}
