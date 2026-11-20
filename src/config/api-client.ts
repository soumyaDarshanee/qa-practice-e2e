import fs from 'node:fs';
import { client, type ClientInstance } from '../@generated/.kubb/client';
import { SESSION_META } from './paths';
import { env } from './env';
import type { Role } from '../tests/test-data/users';

/**
 * The one place that configures the generated API client: base URL from env, token per user.
 * (The improvement on side-effect imports: every caller gets an explicit client.)
 *
 * Usage: suppliersCreate({ client: api, body }).unwrap()
 */
export function createApiClient(token?: string): ClientInstance {
  return client.createClient({
    baseURL: env.API_URL,
    // The API's security scheme is an "Authorization" header holding "Token <key>".
    auth: token ? `Token ${token}` : undefined,
  });
}

export interface SessionMeta {
  token: string;
  organisationId: number;
}

export function readSessionMeta(role: Role): SessionMeta {
  const file = SESSION_META[role];
  if (!fs.existsSync(file)) {
    throw new Error(`No saved session for "${role}". Run the auth setup project first (npx playwright test).`);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8')) as SessionMeta;
}

/** A client that acts as one of the roles logged in by auth setup. */
export function apiClientFor(role: Role): ClientInstance {
  return createApiClient(readSessionMeta(role).token);
}
