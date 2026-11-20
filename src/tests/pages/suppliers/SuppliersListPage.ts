import { expect, type Locator, type Page } from '@playwright/test';
import { BasePage } from '../base/BasePage';

export type SupplierFilters = { search?: string; status?: string; risk_level?: string; country?: string };

export class SuppliersListPage extends BasePage {
  readonly heading: Locator;
  readonly addSupplierButton: Locator;
  readonly searchInput: Locator;
  readonly table: Locator;
  readonly rows: Locator;
  readonly emptyState: Locator;
  private readonly filters: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByTestId('suppliers-heading');
    this.addSupplierButton = page.getByRole('button', { name: 'Add supplier' });
    // Scoped to the filter bar, so "Status" never matches the field in the Add supplier dialog.
    this.filters = page.getByRole('search');
    this.searchInput = this.filters.getByRole('searchbox', { name: 'Search suppliers' });
    this.table = page.getByRole('table', { name: 'Suppliers' });
    this.rows = this.table.getByTestId('supplier-row');
    this.emptyState = page.getByTestId('suppliers-empty');
  }

  /** Filters live in the URL, so a filtered view can be opened directly. */
  async goto(filters: SupplierFilters = {}) {
    const query = new URLSearchParams(Object.entries(filters).filter(([, v]) => v) as [string, string][]).toString();
    await this.page.goto(`/suppliers${query ? `?${query}` : ''}`);
  }

  /** A row found by the supplier's name, not its position. */
  row(name: string): Locator {
    return this.rows.filter({ has: this.page.getByRole('link', { name, exact: true }) });
  }

  async search(text: string) {
    await this.searchInput.fill(text);
  }

  async filterByStatus(status: '' | 'active' | 'inactive' | 'blocked') {
    await this.filters.getByLabel('Status').selectOption(status);
  }

  async clickAddSupplier() {
    await this.addSupplierButton.click();
  }

  async openSupplier(name: string) {
    await this.row(name).getByRole('link', { name, exact: true }).click();
  }

  async verifyResultCount(count: number) {
    await expect(this.heading).toHaveText(`Suppliers (${count})`);
    await expect(this.rows).toHaveCount(count);
  }

  /** Columns: Name | Country | Status | Risk | Certificates */
  async verifySupplierRow(name: string, expected: { country?: string; status?: string; risk?: string }) {
    const cells = this.row(name).getByRole('cell');
    if (expected.country) await expect(cells.nth(1)).toHaveText(expected.country);
    if (expected.status) await expect(cells.nth(2)).toHaveText(expected.status);
    if (expected.risk) await expect(cells.nth(3)).toHaveText(expected.risk);
  }

  async verifyAddSupplierHidden() {
    await expect(this.heading).toBeVisible();
    await expect(this.addSupplierButton).toBeHidden();
  }
}
