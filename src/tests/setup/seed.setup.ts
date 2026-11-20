import { expect, test as setup } from '@playwright/test';
import { e2ESeedStatusRetrieve } from '../../@generated/clients';
import { createApiClient } from '../../config/api-client';
import { env } from '../../config/env';

/**
 * Fail fast with a clear message when the baseline data is missing,
 * instead of a confusing failure deep inside a spec.
 */
setup('baseline seed is loaded', async () => {
  let result: Awaited<ReturnType<typeof e2ESeedStatusRetrieve<false>>>;
  try {
    result = await e2ESeedStatusRetrieve({ client: createApiClient(), throwOnError: false });
  } catch (error) {
    throw new Error(`API not reachable at ${env.API_URL}. Is it running? (docker compose up -d in qa-practice-api)\n${error}`);
  }

  // 404 is not in the schema (the route only exists in E2E mode), so widen the type to check for it.
  if ((result.status as number) === 404) {
    throw new Error('The /api/e2e/ endpoints are off. Start the API with E2E_MODE=true (the default in its docker-compose.yml).');
  }

  expect(
    result.status,
    `Seed check failed: ${JSON.stringify(result.data ?? result.error)}.\n` +
      'Load the baseline with: docker compose exec api python manage.py seed (or make test-setup)',
  ).toBe(200);
});
