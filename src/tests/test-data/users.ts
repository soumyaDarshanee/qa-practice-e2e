/** Baseline users created by the API's seed (make test-setup / POST /api/e2e/reset/). */

export type Role = 'admin' | 'viewer';

export const PASSWORD = 'Password123!';

export const USERS = {
  admin: { email: 'admin@qa.test', organisation: 'Green Valley Foods' },
  viewer: { email: 'viewer@qa.test', organisation: 'Green Valley Foods' },
  // Lives in another organisation: for tenant-isolation tests.
  otherAdmin: { email: 'other-admin@qa.test', organisation: 'Blue River Trading' },
} as const;

export const ROLES: Role[] = ['admin', 'viewer'];
