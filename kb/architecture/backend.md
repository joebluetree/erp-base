# Backend Architecture

Implements the PRD in `kb/platform/backend.md`. Code lives in `backend/`. Setup commands are in `backend/README.md`.

## Overview

A modular monolith on ASP.NET Core (.NET 9) with Oracle and EF Core. One deployable (`iErp.Api`) hosts business modules that are separate class libraries. All modules share one `AppDbContext`.

Request flow:

```
Controller -> Service -> Repository -> AppDbContext
                  \-> IUnitOfWork (save / transaction)
```

## Solution structure

```
backend/
  iErp.sln
  Directory.Build.props      net9.0, nullable, warnings as errors
  Directory.Packages.props   central package versions
  iErp.Api                   host: Program, middleware, config
  iErp.Data                  AppDbContext, entity configurations, migrations, repository base, unit of work
  iErp.Entities              entities only
  iErp.Shared                technical helpers (NotFoundException, problem-details factory)
  iErp.SharedBusiness        reusable business functionality (empty for now)
  iErp.ModuleTemplate        reference module (Todos feature)
  iErp.Tests                 unit, integration, architecture tests
```

All projects sit directly under `backend/` (no `src/` or `tests/` folders) and use the `iErp` prefix.

## Dependency rules

| Project | May reference |
|---|---|
| Entities | nothing |
| Shared | nothing |
| Data | Entities |
| SharedBusiness | Entities, Shared |
| Modules | Entities, Data, Shared, SharedBusiness |
| Api | Data, Shared, every module |

Modules never reference Api or each other. These rules are enforced by `Architecture/DependencyRuleTests.cs`. Controllers must not depend on `iErp.Data`.

## Modules and features

A module is grouped by feature folder. `ModuleTemplate/Todos/` contains everything for the Todo feature:

- `TodosController`: HTTP only.
- `ITodoService` / `TodoService`: business logic.
- `ITodoRepository` / `TodoRepository`: data access.
- `TodoDtos.cs`: request/response records and manual mapping.
- `TodoSaveRequestValidator`: FluentValidation rules.

Each module exposes one registration method (`AddModuleTemplate`). `Program.cs` calls it and adds the module assembly as an MVC application part so its controllers are routed.

## Patterns

**Controller.** Binds the request, calls one service method, maps the result to a status code. No validation or business code.

**Service.** Business rules. Throws `NotFoundException` for missing resources and saves through `IUnitOfWork`.

**Repository.** Derives from `Repository<T>` (`GetByIdAsync`, `ListAsync`, `Add`, `Remove`). Repositories stage changes and never call `SaveChanges`.

**Unit of work.** `IUnitOfWork.SaveChangesAsync` commits staged changes in one database transaction. `ExecuteInTransactionAsync` wraps several operations in an explicit transaction and rolls back on error.

**Single save.** `POST /api/todos` creates when `id` is null (201) and updates when `id` is given (200, or 404 if it does not exist).

**Mapping.** DTO to entity is manual (`TodoMapping`). No mapping library.

## API

| Method and route | Result |
|---|---|
| `POST /api/todos` | 201 created, 200 updated, 400 invalid, 404 unknown id |
| `GET /api/todos/{id}` | 200, 404 |
| `GET /api/todos` | 200 (empty list when none) |
| `DELETE /api/todos/{id}` | 204, 404 |

Swagger UI is at `/swagger` in every environment except Production.

## Database integration

- Oracle through `Oracle.EntityFrameworkCore` 9.x (matches EF Core 9).
- Entity mappings are Fluent API classes in `iErp.Data/Configurations`, discovered by `AppDbContext`.
- The target database is Oracle 10.2, which the provider does not officially support. `Oracle10gCompatibilityInterceptor` (registered in `AddData` and the design-time factory) normalizes line endings in provider-generated PL/SQL to LF and rewrites `FETCH FIRST n ROWS ONLY` to a `ROWNUM` wrapper. OFFSET paging is not supported. New features must be verified against 10g.
- Table and column names are explicit and upper-case (`TODO_ITEMS`, `IS_COMPLETED`).
- Guid keys map to `RAW(16)` and are generated in code. Booleans map to `NUMBER(1)` so the schema also works on Oracle versions before 23ai.
- Connection string: `ConnectionStrings:Default`, from user secrets or `ConnectionStrings__Default`. Startup fails with a clear message when it is missing. No secrets are committed.
- Migrations live in `iErp.Data/Migrations`. A design-time factory lets `dotnet ef` generate migrations without a database.

## Validation and exception handling

- `ValidationFilter` runs the FluentValidation validator for each action argument and returns 400 with `ValidationProblemDetails` (errors grouped by field).
- `GlobalExceptionHandler` maps `NotFoundException` to 404 and everything else to a generic 500. All errors are RFC 7807 problem details with a `traceId`. Exception details are logged, never returned.

## Logging and configuration

Serilog (console sink) configured from `appsettings`, plus request logging. `appsettings.{Development,Testing,Production}.json` override the base file.

## Testing

xUnit, in `iErp.Tests`:

- `Unit/`: `TodoService` (with NSubstitute fakes) and the validator. No database.
- `Integration/TodoPipelineTests`: real HTTP pipeline with a fake service. Covers routing, validation, error format, Swagger. No database.
- `Integration/TodoOracleTests`: CRUD round trip against Oracle. Skipped unless `IERP_TEST_ORACLE` holds a connection string for a schema with migrations applied.
- `Architecture/`: dependency rules.

## Adding a module

1. Create `iErp.<Name>` directly under `backend/` referencing only the projects allowed in the table above, and add it to `iErp.sln`.
2. Add entities to `iErp.Entities`, their configuration to `iErp.Data/Configurations`, then a migration.
3. Add `Add<Name>(IServiceCollection)` that registers its services, repositories and validators.
4. In `iErp.Api`: reference the project, call the registration method, and add its assembly as an application part.
5. Add unit tests and extend the architecture tests if the module introduces new rules.

## Adding a feature to a module

Create a feature folder with controller, service, repository, DTOs and validator, following `ModuleTemplate/Todos`. Register the service, repository and validator in the module's registration method.
