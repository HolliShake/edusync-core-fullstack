import type { UserRoleEnum } from '@rest/models';

export const can = (
  role: UserRoleEnum | UserRoleEnum[],
  userRolesFromServer: UserRoleEnum[]
): boolean => {
  if (Array.isArray(role)) {
    return role.some((r) => (userRolesFromServer ?? []).includes(r));
  }
  return (userRolesFromServer ?? []).includes(role as UserRoleEnum);
};
