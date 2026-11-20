import fs from 'node:fs';
import path from 'node:path';
import { expect, test as setup } from '@playwright/test';
import { authMeRetrieve } from '../../@generated/clients';
import { createApiClient, type SessionMeta } from '../../config/api-client';
import { SESSION_META, STORAGE_STATE } from '../../config/paths';
import { LoginPage } from '../pages/auth/LoginPage';
import { PASSWORD, ROLES, USERS } from '../test-data/users';

const TOKEN_KEY = 'qa-practice-token'; // where the web app keeps its token in localStorage

/**
 * Log in once per role and save the session. Every spec then starts logged in,
 * without repeating the login flow (the login itself is tested in specs/auth).
 */
for (const role of ROLES) {
  setup(`log in as ${role}`, async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(USERS[role].email, PASSWORD);
    await expect(page.getByTestId('current-user')).toHaveText(USERS[role].email);

    // Keep the token and organisation id, so tests can call the API as this user.
    const token = await page.evaluate((key) => localStorage.getItem(key), TOKEN_KEY);
    expect(token, `the app stores the token in localStorage under "${TOKEN_KEY}"`).toBeTruthy();
    const me = await authMeRetrieve({ client: createApiClient(token!) }).unwrap();
    const meta: SessionMeta = { token: token!, organisationId: me.organisation.id };

    fs.mkdirSync(path.dirname(SESSION_META[role]), { recursive: true });
    fs.writeFileSync(SESSION_META[role], JSON.stringify(meta, null, 2));
    await page.context().storageState({ path: STORAGE_STATE[role] });
  });
}
