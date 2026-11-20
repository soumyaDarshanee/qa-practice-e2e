import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export class SupplierDetailPage extends BasePage {
  readonly name: Locator;
  readonly summary: Locator;
  readonly editButton: Locator;
  readonly deleteButton: Locator;

  constructor(page: Page) {
    super(page);
    this.name = page.getByTestId('supplier-name');
    this.summary = page.getByTestId('supplier-summary');
    this.editButton = page.getByRole('button', { name: 'Edit', exact: true });
    this.deleteButton = page.getByRole('button', { name: 'Delete', exact: true });
  }

  async goto(id: number) {
    await this.page.goto(`/suppliers/${id}`);
  }

  /** The <dd> right after the <dt> with this label. */
  summaryValue(label: string): Locator {
    return this.summary.locator('dt', { hasText: label }).locator('xpath=following-sibling::dd[1]');
  }

  /** Reads the supplier id from the URL (/suppliers/123), e.g. to clean up a supplier created in the UI. */
  async supplierIdFromUrl(): Promise<number> {
    await expect(this.page).toHaveURL(/\/suppliers\/\d+$/);
    return Number(new URL(this.page.url()).pathname.split('/').pop());
  }

  async verifyName(name: string) {
    await expect(this.name).toHaveText(name);
  }

  async verifySummary(expected: Record<string, string>) {
    for (const [label, value] of Object.entries(expected)) {
      await expect(this.summaryValue(label)).toHaveText(value);
    }
  }
}
