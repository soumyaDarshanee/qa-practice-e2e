/** Expected notification texts, so a copy change is a one-line update. */
export const SNACKBARS = {
  supplierCreated: (name: string) => `Supplier "${name}" created.`,
  supplierUpdated: 'Supplier updated.',
  supplierDeleted: (name: string) => `Supplier "${name}" deleted.`,
  certificateAdded: 'Certificate added.',
  auditAdded: 'Audit added.',
  loggedOut: 'You have been logged out.',
} as const;
