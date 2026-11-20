import { STORAGE_STATE } from '../../../config/paths';
import { expect, test } from '../../fixtures';
import { COUNTRIES } from '../../test-data/countries';

test.describe('Supplier list', () => {
  test('search finds a supplier by name', { tag: '@smoke' }, async ({ suppliersListPage, suppliers }) => {
    const supplier = await suppliers.create({ country: 'DE', status: 'blocked', risk_level: 'medium' });

    await suppliersListPage.goto();
    await suppliersListPage.search(supplier.name);

    // The search is debounced: web-first assertions wait for the result, no fixed waits.
    await suppliersListPage.verifyResultCount(1);
    await suppliersListPage.verifySupplierRow(supplier.name, {
      country: COUNTRIES.DE,
      status: 'blocked',
      risk: 'medium',
    });
  });

  test('a filtered view can be opened from the URL', { tag: '@regression' }, async ({ suppliersListPage, suppliers }) => {
    const blocked = await suppliers.create({ status: 'blocked' });

    await suppliersListPage.goto({ search: blocked.name, status: 'active' });
    await expect(suppliersListPage.emptyState).toBeVisible();

    await suppliersListPage.filterByStatus('blocked');
    await suppliersListPage.verifyResultCount(1);
  });

  test.describe('as viewer', () => {
    test.use({ storageState: STORAGE_STATE.viewer });

    test('sees suppliers but cannot add one', { tag: '@regression' }, async ({ suppliersListPage, suppliers }) => {
      const supplier = await suppliers.create(); // created by admin, same organisation

      await suppliersListPage.goto({ search: supplier.name });
      await expect(suppliersListPage.row(supplier.name)).toBeVisible();
      await suppliersListPage.verifyAddSupplierHidden();
    });
  });
});
