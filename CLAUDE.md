# Conventions for AI-assisted changes

- Never edit `src/@generated/`. Regenerate with `npm run types`.
- Create test data through `src/factories/` (API), not through the UI, unless the UI flow is what's under test.
- Every page object and helper is registered in `src/tests/fixtures/index.ts`; specs receive them as parameters.
- Locators: `getByRole` / `getByLabel` first, then `getByTestId`. Scope to a container. No CSS chains or `nth()` on lists of records.
- Assertions live in page-object `verify*` methods and use web-first matchers. No `waitForTimeout`.
- Expected UI text goes in `src/tests/messages/` or `src/tests/snackbars/`.
- Use unique names (faker) and clean up created data (`suppliers.create` / `suppliers.track`).
- One scenario per test, `test.step` for readable reports, tag with `@smoke` or `@regression`.
- Run `npm run typecheck` before committing.
