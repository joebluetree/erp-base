# Proposal

## Why

The backend foundation shipped with a Todo CRUD as its reference feature. The Todo feature is going to get its own PRD, so it should not live inside the foundation. Removing it leaves the foundation with only the shared infrastructure (host, data layer, validation, error handling, logging, tests) and an empty module skeleton.

## What Changes

- Remove the Todo API (controller, service, repository, DTOs, validator, mapping) from `ModuleTemplate`. The project stays as an empty module skeleton with its registration entry point.
- Remove the `TodoItem` entity, its EF configuration and its `AppDbContext` set. The repository base, unit of work and Oracle 10g interceptor stay.
- Add a migration that drops the `TODO_ITEMS` table. **Applying it to the Oracle schema deletes the table and its data**, so it is applied only after separate confirmation.
- Remove the Todo unit tests and pipeline tests. Replace them with tests that do not depend on a business feature: the HTTP pipeline (validation, not found, unexpected errors, Swagger) through a test-only controller, and Oracle connectivity.
- Retire the `todo-items` capability. Update the `backend-api-host` and `backend-testing` specs, which mention Todo.
- Update `kb/architecture/backend.md` and `backend/README.md`.

Out of scope: any replacement feature (the Todo PRD will add it back), frontend changes (handled in `frontend-foundation` and `app-shell`).

Assumptions:
- `iErp.Entities` stays as a project with a marker type so the architecture tests can still reference its assembly.
- The test-only controller lives in the test project and is never part of the shipped API.
- The existing `InitialCreate` migration stays in history; the new migration drops the table, so databases that have the table are brought forward correctly.

## Capabilities

### New Capabilities
<!-- None. -->

### Modified Capabilities
- `todo-items`: retired. All four requirements are removed.
- `backend-api-host`: the Swagger scenario no longer expects Todo endpoints.
- `backend-testing`: unit and integration test requirements no longer target the Todo feature.

## Impact

- `backend/` only: `iErp.ModuleTemplate`, `iErp.Entities`, `iErp.Data` (configuration, context, migrations), `iErp.Tests`.
- The `TODO_ITEMS` table in any Oracle schema that has it (dropped only on confirmation).
- The frontend's Todo screens lose their API, so the frontend removal must be applied too.
