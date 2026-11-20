import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly formError: Locator;

  constructor(readonly page: Page) {
    const form = page.getByRole('form', { name: 'Log in' });
    this.emailInput = form.getByLabel('Email');
    this.passwordInput = form.getByLabel('Password');
    this.submitButton = form.getByRole('button', { name: 'Log in' });
    this.formError = form.getByTestId('form-error');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async verifyError(message: string) {
    await expect(this.formError).toHaveText(message);
  }

  async verifyOnLoginPage() {
    await expect(this.page).toHaveURL(/\/login$/);
    await expect(this.submitButton).toBeVisible();
  }
}
