## 1. Solution scaffolding

- [x] 1.1 Create `backend/` with `Backend.sln`, `Directory.Build.props` (net9.0, nullable, implicit usings, warnings as errors) and `Directory.Packages.props`
- [x] 1.2 Create projects Api, Data, Entities, Shared, SharedBusiness, ModuleTemplate, Tests with the reference graph from design.md
- [x] 1.3 Add `.gitignore` for build output and `.editorconfig`; verify `dotnet build` passes on the empty solution
- [x] 1.4 Verify the Oracle.EntityFrameworkCore version resolves against EF Core 9 before continuing

## 2. Shared and entities

- [x] 2.1 Add `NotFoundException` and shared problem-details helpers in Shared
- [x] 2.2 Add `TodoItem` entity (Guid Id, Title, Description, IsCompleted) in Entities

## 3. Data layer

- [x] 3.1 Add `AppDbContext` applying configurations from the Data assembly
- [x] 3.2 Add `TodoItemConfiguration` (table/column names, RAW(16) key, title max 200)
- [x] 3.3 Add `IUnitOfWork`/`UnitOfWork` (save, transaction) and base repository abstraction
- [x] 3.4 Add the `AddData(IConfiguration)` registration reading `ConnectionStrings:Default`, failing clearly when missing
- [x] 3.5 Create the initial migration for `TodoItem`

## 4. ModuleTemplate Todo feature

- [x] 4.1 Add DTOs (`TodoSaveRequest`, `TodoResponse`) and manual mapping
- [x] 4.2 Add `TodoSaveRequestValidator` (title required, max 200)
- [x] 4.3 Add `ITodoRepository`/`TodoRepository`
- [x] 4.4 Add `ITodoService`/`TodoService` with single `SaveAsync`, `GetAsync`, `ListAsync`, `DeleteAsync`
- [x] 4.5 Add `TodosController` (POST save 201/200, GET by id, GET list, DELETE 204) with cancellation tokens
- [x] 4.6 Add `AddModuleTemplate` registration

## 5. Api host

- [x] 5.1 Wire `Program.cs`: data, module registration, controllers from module assemblies, FluentValidation filter
- [x] 5.2 Add global exception handler (404 for not found, generic 500 with trace id) and validation 400 format
- [x] 5.3 Add Serilog structured logging and request logging
- [x] 5.4 Add Swagger (non-Production) and `appsettings` for Development/Testing/Production with no secrets; document user-secrets setup
- [x] 5.5 Make `Program` accessible to integration tests

## 6. Tests

- [x] 6.1 Unit tests for `TodoService` (create, update, not found, delete) and the validator
- [x] 6.2 Integration tests for Todo endpoints via `WebApplicationFactory` against Oracle, trait-gated on connection string
- [x] 6.3 Architecture tests for the dependency rules in the solution-structure spec
- [x] 6.4 Run the suite; record which tests ran and any skipped (e.g. Oracle absent)

## 7. Documentation and verification

- [x] 7.1 Write `kb/architecture/backend.md` from the implemented code, with the setup instructions (connection string, migrations, run, test)
- [x] 7.2 Walk the PRD acceptance checklist and confirm each item against the running API

## 8. FR-013 flat layout and iErp naming

- [x] 8.1 Move project folders from `src/` and `tests/` directly under `backend/`; fix project references and the solution file
- [x] 8.2 Rename the prefix `Cargomar` to `iErp` in folder, project and file names, namespaces, `RootNamespace`, user-secrets id, migrations and test references; rename the solution to `iErp.sln`
- [x] 8.3 Rebuild and verify the migration namespace and model snapshot match
- [x] 8.4 Update `backend/README.md` and `kb/architecture/backend.md` for the new paths and names
- [x] 8.5 Re-run all tests including architecture tests

## 9. Oracle 10g compatibility

- [x] 9.1 Add the 10g compatibility interceptor (LF line endings, `FETCH FIRST` to `ROWNUM`) and register it at runtime and design time
- [x] 9.2 Unit-test the SQL rewrite
- [x] 9.3 Apply the migration and run the Oracle integration test against the 10.2 database
