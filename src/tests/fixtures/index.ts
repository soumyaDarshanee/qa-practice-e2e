import { test as base } from '@playwright/test';
import type { ClientInstance } from '../../@generated/.kubb/client';
import type { Supplier, SupplierRequest } from '../../@generated/types';
import { apiClientFor } from '../../config/api-client';
import { createSupplier, deleteSupplier } from '../../factories/suppliers';
import { LoginPage } from '../pages/auth/LoginPage';
import { BasePage } from '../pages/base/BasePage';
import { SupplierDetailPage } from '../pages/suppliers/SupplierDetailPage';
import { SupplierDialog } from '../pages/suppliers/SupplierDialog';
import { SuppliersListPage } from '../pages/suppliers/SuppliersListPage';

type Pages = {
  basePage: BasePage;
  loginPage: LoginPage;
  suppliersListPage: SuppliersListPage;
  supplierDialog: SupplierDialog;
  supplierDetailPage: SupplierDetailPage;
};

type Api = {
  /** API client acting as admin@qa.test (token saved by auth setup). */
  adminApi: ClientInstance;
  /** API client acting as viewer@qa.test. */
  viewerApi: ClientInstance;
};

type Data = {
  /**
   * Creates suppliers through the API and deletes them after the test.
   * Call track(id) for a supplier the test created through the UI, so it is cleaned up too.
   */
  suppliers: {
    create: (overrides?: Partial<SupplierRequest>) => Promise<Supplier>;
    track: (id: number) => void;
  };
};

/**
 * The single wiring point: specs get page objects, API clients and factories as parameters
 * and never construct them themselves.
 */
export const test = base.extend<Pages & Api & Data>({
  basePage: async ({ page }, use) => use(new BasePage(page)),
  loginPage: async ({ page }, use) => use(new LoginPage(page)),
  suppliersListPage: async ({ page }, use) => use(new SuppliersListPage(page)),
  supplierDialog: async ({ page }, use) => use(new SupplierDialog(page)),
  supplierDetailPage: async ({ page }, use) => use(new SupplierDetailPage(page)),

  // eslint-disable-next-line no-empty-pattern
  adminApi: async ({}, use) => use(apiClientFor('admin')),
  // eslint-disable-next-line no-empty-pattern
  viewerApi: async ({}, use) => use(apiClientFor('viewer')),

  suppliers: async ({ adminApi }, use) => {
    const created: number[] = [];
    await use({
      create: async (overrides) => {
        const supplier = await createSupplier(adminApi, overrides);
        created.push(supplier.id);
        return supplier;
      },
      track: (id) => {
        created.push(id);
      },
    });
    // Teardown (runs like afterEach): delete everything this test made. Deleting a supplier
    // also deletes its certificates and audits. Already deleted by the test? That's fine.
    for (const id of created) {
      await deleteSupplier(adminApi, id).catch(() => undefined);
    }
  },
});

export { expect } from '@playwright/test';
