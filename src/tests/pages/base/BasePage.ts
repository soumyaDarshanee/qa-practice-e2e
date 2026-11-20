import { expect, type Locator, type Page } from '@playwright/test';

/** Shared UI on every logged-in page: header, navigation, snackbars. */
export class BasePage {
  readonly snackbars: Locator;
  readonly currentUser: Locator;
  readonly currentRole: Locator;
  readonly currentOrganisation: Locator;
  readonly logoutButton: Locator;

  constructor(readonly page: Page) {
    this.snackbars = page.getByTestId('snackbar');
    this.currentUser = page.getByTestId('current-user');
    this.currentRole = page.getByTestId('current-role');
    this.currentOrganisation = page.getByTestId('current-organisation');
    this.logoutButton = page.getByRole('button', { name: 'Log out' });
  }

  navLink(name: 'Dashboard' | 'Suppliers'): Locator {
    return this.page.getByRole('navigation', { name: 'Main' }).getByRole('link', { name });
  }

  async logout() {
    await this.logoutButton.click();
  }

  async verifySnackbar(text: string) {
    await expect(this.snackbars.filter({ hasText: text })).toBeVisible();
  }

  async verifyLoggedInAs(email: string, role: string) {
    await expect(this.currentUser).toHaveText(email);
    await expect(this.currentRole).toHaveText(role);
  }
}
