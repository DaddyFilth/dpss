export type AppRole = 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN';

export const isAdminRole = (role: unknown): role is 'ADMIN' | 'SUPER_ADMIN' => {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
};

export const isSuperAdminRole = (role: unknown): role is 'SUPER_ADMIN' => {
  return role === 'SUPER_ADMIN';
};

export const getSessionRole = (session: unknown): AppRole | undefined => {
  const role = (session as { user?: { role?: unknown } } | null)?.user?.role;
  return typeof role === 'string' ? (role as AppRole) : undefined;
};
