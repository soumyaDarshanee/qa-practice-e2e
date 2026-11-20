import { authLoginCreate, suppliersCreate, suppliersList, suppliersRetrieve } from '../../../@generated/clients';
import { createApiClient } from '../../../config/api-client';
import { buildSupplier } from '../../../factories/suppliers';
import { expect, test } from '../../fixtures';
import { PASSWORD, USERS } from '../../test-data/users';

/** API-only checks of the permission and tenancy rules. No browser page is used. */
test.describe('Suppliers API', () => {
  test('a viewer cannot create a supplier (403)', { tag: '@regression' }, async ({ viewerApi }) => {
    const result = await suppliersCreate({ client: viewerApi, body: buildSupplier(), throwOnError: false });
    expect(result.status).toBe(403);
  });

  test('a request without a token is rejected (401)', { tag: '@regression' }, async () => {
    const result = await suppliersList({ client: createApiClient(), throwOnError: false });
    expect(result.status).toBe(401);
  });

  test("another organisation's supplier is not found (404)", { tag: '@regression' }, async ({ suppliers }) => {
    const supplier = await suppliers.create(); // in Green Valley Foods

    const login = await authLoginCreate({
      client: createApiClient(),
      body: { email: USERS.otherAdmin.email, password: PASSWORD },
    }).unwrap();
    const otherOrgApi = createApiClient(login.token);

    const result = await suppliersRetrieve({
      client: otherOrgApi,
      path: { id: String(supplier.id) },
      throwOnError: false,
    });
    expect(result.status).toBe(404);
  });
});
