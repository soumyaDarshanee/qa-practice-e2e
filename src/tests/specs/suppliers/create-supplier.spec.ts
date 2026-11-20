import { faker } from '@faker-js/faker';
import { uniqueSupplierName } from '../../../factories/suppliers';
import { test } from '../../fixtures';
import { SUPPLIER_MESSAGES } from '../../messages/suppliers';
import { SNACKBARS } from '../../snackbars';
import { COUNTRIES } from '../../test-data/countries';

test.describe('Create supplier', () => {
  test(
    'admin creates a supplier and sees its details',
    { tag: '@smoke' },
    async ({ suppliersListPage, supplierDialog, supplierDetailPage, suppliers }) => {
      const supplier = {
        name: uniqueSupplierName(),
        email: faker.internet.email().toLowerCase(),
        contactName: faker.person.fullName(),
        country: COUNTRIES.PE,
        status: 'active' as const,
        riskLevel: 'high' as const,
      };

      await test.step('fill in and save the Add supplier dialog', async () => {
        await suppliersListPage.goto();
        await suppliersListPage.clickAddSupplier();
        await supplierDialog.verifyOpen('Add supplier');
        await supplierDialog.fill(supplier);
        await supplierDialog.save();
      });

      await test.step('lands on the detail page with the saved values', async () => {
        await supplierDetailPage.verifySnackbar(SNACKBARS.supplierCreated(supplier.name));
        suppliers.track(await supplierDetailPage.supplierIdFromUrl()); // clean up after the test
        await supplierDetailPage.verifyName(supplier.name);
        await supplierDetailPage.verifySummary({
          Email: supplier.email,
          Contact: supplier.contactName,
          Country: supplier.country,
          Status: supplier.status,
          'Risk level': supplier.riskLevel,
        });
      });
    },
  );

  test('a duplicate name is rejected', { tag: '@regression' }, async ({ suppliersListPage, supplierDialog, suppliers }) => {
    // Seed with the API, act with the UI.
    const existing = await suppliers.create();

    await suppliersListPage.goto();
    await suppliersListPage.clickAddSupplier();
    await supplierDialog.fill({
      // Same name in different casing: the API compares names case-insensitively.
      name: existing.name.toUpperCase(),
      email: faker.internet.email().toLowerCase(),
      country: COUNTRIES.NL,
    });
    await supplierDialog.save();

    await supplierDialog.verifyFieldError('Name', SUPPLIER_MESSAGES.duplicateName);
    await supplierDialog.verifyOpen('Add supplier');
  });
});
