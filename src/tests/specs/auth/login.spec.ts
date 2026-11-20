import { test } from '../../fixtures';
import { AUTH_MESSAGES } from '../../messages/auth';
import { SNACKBARS } from '../../snackbars';
import { PASSWORD, USERS } from '../../test-data/users';

// These tests are about logging in, so they start logged out.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', () => {
  test('admin can log in and log out', { tag: '@smoke' }, async ({ loginPage, basePage }) => {
    await test.step('log in', async () => {
      await loginPage.goto();
      await loginPage.login(USERS.admin.email, PASSWORD);
    });

    await test.step('header shows the user, role and organisation', async () => {
      await basePage.verifyLoggedInAs(USERS.admin.email, 'admin');
    });

    await test.step('log out', async () => {
      await basePage.logout();
      await basePage.verifySnackbar(SNACKBARS.loggedOut);
      await loginPage.verifyOnLoginPage();
    });
  });

  test('wrong password shows an error', { tag: '@regression' }, async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login(USERS.admin.email, 'not-the-password');
    await loginPage.verifyError(AUTH_MESSAGES.invalidLogin);
    await loginPage.verifyOnLoginPage();
  });
});
