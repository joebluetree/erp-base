## 1. Remove the Todo code

- [x] 1.1 Delete `iErp.ModuleTemplate/Todos` (controller, service, repository, DTOs, validator) and update `ModuleTemplateRegistration` so it registers no Todo types (keep FluentValidation validator discovery)
- [x] 1.2 Delete `iErp.Entities/Todos/TodoItem` and add `EntitiesMarker`
- [x] 1.3 Delete `TodoItemConfiguration`, remove the `TodoItems` set from `AppDbContext`
- [x] 1.4 Generate the `RemoveTodoItems` migration and confirm it drops `TODO_ITEMS` and leaves an empty model snapshot (do not apply it)

## 2. Tests

- [x] 2.1 Delete `TodoServiceTests`, `TodoSaveRequestValidatorTests`, `TodoPipelineTests` and `TodoOracleTests`
- [x] 2.2 Add the test-only controller and validator, update `ApiFactory`, and add pipeline tests for 404, 500 without internal detail, 400 grouped by field, and Swagger JSON
- [x] 2.3 Add the Oracle connectivity test (skipped without `IERP_TEST_ORACLE`)
- [x] 2.4 Point the architecture tests at `EntitiesMarker` and add the test-code-not-in-product-assemblies check
- [x] 2.5 Run the build and the full test suite; record results

## 3. Documentation

- [x] 3.1 Update `kb/architecture/backend.md` and `backend/README.md` (remove the Todo feature, keep the patterns as guidance, update tests and the migration note)

## 4. Database (needs separate confirmation)

- [x] 4.1 Apply `RemoveTodoItems` to the Oracle schema and confirm the table is gone (checked 2026-10-08: `TODO_ITEMS` and the migration history table were already absent from ICARDATA, so nothing needed dropping; any database that still has the table gets it dropped by `dotnet ef database update`)
