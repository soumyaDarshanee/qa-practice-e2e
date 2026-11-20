import { faker } from '@faker-js/faker';
import type { ClientInstance } from '../@generated/.kubb/client';
import { auditsCreate } from '../@generated/clients';
import { createAuditRequest } from '../@generated/mocks';
import type { Audit, AuditRequest } from '../@generated/types';
import { daysFromToday } from './dates';

/** A passing audit (score 85) from last week. Pass score: 50 for a failed one. */
export function buildAudit(supplierId: number, overrides: Partial<AuditRequest> = {}): AuditRequest {
  return {
    ...createAuditRequest(),
    supplier: supplierId,
    audit_date: daysFromToday(-7),
    auditor: faker.person.fullName(),
    score: 85,
    notes: 'Created by an e2e test.',
    ...overrides,
  };
}

export const createAudit = (api: ClientInstance, supplierId: number, overrides: Partial<AuditRequest> = {}): Promise<Audit> =>
  auditsCreate({ client: api, body: buildAudit(supplierId, overrides) }).unwrap();
