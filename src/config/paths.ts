import path from 'node:path';
import type { Role } from '../tests/test-data/users';

const AUTH_DIR = path.join(__dirname, '..', 'tests', 'auth', 'users');

/** Saved browser session per role (cookies + localStorage, which holds the app's token). Git-ignored. */
export const STORAGE_STATE: Record<Role, string> = {
  admin: path.join(AUTH_DIR, 'admin.json'),
  viewer: path.join(AUTH_DIR, 'viewer.json'),
};

/** API token + organisation id per role, captured during auth setup. Git-ignored. */
export const SESSION_META: Record<Role, string> = {
  admin: path.join(AUTH_DIR, 'admin.meta.json'),
  viewer: path.join(AUTH_DIR, 'viewer.meta.json'),
};
