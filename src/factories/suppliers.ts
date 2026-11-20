import { faker } from '@faker-js/faker';
import type { ClientInstance } from '../@generated/.kubb/client';
import { suppliersCreate, suppliersDestroy } from '../@generated/clients';
import { createSupplierRequest } from '../@generated/mocks';
import type { Supplier, SupplierRequest } from '../@generated/types';

export const uniqueSupplierName = () => `E2E Supplier ${faker.string.alphanumeric(8)}`;

/**
 * Valid supplier data. The generated faker builder only knows the schema (random letters, a
 * 1-letter country), so we override what the business rules need: a unique name and a real
 * country code from the reference data.
 */
export function buildSupplier(overrides: Partial<SupplierRequest> = {}): SupplierRequest {
  return {
    ...createSupplierRequest(),
    name: uniqueSupplierName(),
    email: faker.internet.email().toLowerCase(),
    contact_name: faker.person.fullName(),
    country: 'NL',
    status: 'active',
    risk_level: 'low',
    ...overrides,
  };
}

export const createSupplier = (api: ClientInstance, overrides: Partial<SupplierRequest> = {}): Promise<Supplier> =>
  suppliersCreate({ client: api, body: buildSupplier(overrides) }).unwrap();

export const deleteSupplier = (api: ClientInstance, id: number) =>
  suppliersDestroy({ client: api, path: { id: String(id) } }).unwrap();
