import { faker } from '@faker-js/faker';
import type { ClientInstance } from '../@generated/.kubb/client';
import { certificatesCreate } from '../@generated/clients';
import { createCertificateRequest } from '../@generated/mocks';
import type { Certificate, CertificateRequest } from '../@generated/types';
import { daysFromToday } from './dates';

/** A valid certificate (expires in a year) for the given supplier. Pass expiry_date to get expiring/expired. */
export function buildCertificate(supplierId: number, overrides: Partial<CertificateRequest> = {}): CertificateRequest {
  return {
    ...createCertificateRequest(),
    supplier: supplierId,
    certificate_type: 'globalgap',
    certificate_number: `GG-${faker.string.alphanumeric(8).toUpperCase()}`,
    issue_date: daysFromToday(-30),
    expiry_date: daysFromToday(365),
    ...overrides,
  };
}

export const createCertificate = (
  api: ClientInstance,
  supplierId: number,
  overrides: Partial<CertificateRequest> = {},
): Promise<Certificate> => certificatesCreate({ client: api, body: buildCertificate(supplierId, overrides) }).unwrap();
