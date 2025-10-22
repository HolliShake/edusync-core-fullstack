import type { UserRole } from '@/enums/role-enum';

export const can = (role: UserRole | UserRole[], userRolesFromServer: UserRole[]) => {
  if (Array.isArray(role)) {
    return role.some((r) => (userRolesFromServer ?? []).includes(r));
  }
  return (userRolesFromServer ?? []).includes(role);
};
