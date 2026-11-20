import { expect, type Locator, type Page } from '@playwright/test';

export type SupplierFormData = {
  name?: string;
  email?: string;
  contactName?: string;
  /** The country's name as shown in the dropdown, e.g. "Netherlands". */
  country?: string;
  status?: 'active' | 'inactive' | 'blocked';
  riskLevel?: 'low' | 'medium' | 'high';
};

/** The Add / Edit supplier dialog. */
export class SupplierDialog {
  readonly root: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(readonly page: Page) {
    this.root = page.getByRole('dialog', { name: /^(Add|Edit) supplier$/ });
    this.saveButton = this.root.getByRole('button', { name: 'Save' });
    this.cancelButton = this.root.getByRole('button', { name: 'Cancel' });
  }

  field(label: 'Name' | 'Email' | 'Contact name' | 'Country' | 'Status' | 'Risk level'): Locator {
    return this.root.getByLabel(label, { exact: true });
  }

  async fill(data: SupplierFormData) {
    if (data.name !== undefined) await this.field('Name').fill(data.name);
    if (data.email !== undefined) await this.field('Email').fill(data.email);
    if (data.contactName !== undefined) await this.field('Contact name').fill(data.contactName);
    if (data.country !== undefined) await this.field('Country').selectOption({ label: data.country });
    if (data.status !== undefined) await this.field('Status').selectOption(data.status);
    if (data.riskLevel !== undefined) await this.field('Risk level').selectOption(data.riskLevel);
  }

  async save() {
    await this.saveButton.click();
  }

  async verifyOpen(title: 'Add supplier' | 'Edit supplier') {
    await expect(this.root).toBeVisible();
    await expect(this.root.getByRole('heading', { name: title })).toBeVisible();
  }

  /** The error text is linked to its input with aria-describedby, so we check the input's description. */
  async verifyFieldError(label: Parameters<SupplierDialog['field']>[0], message: string) {
    const input = this.field(label);
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription(message);
  }
}
