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
  iErp.ModuleTemplate        module skeleton (registration entry point, no feature yet)
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

A module is grouped by feature folder. `ModuleTemplate` is an empty skeleton: it has no feature yet, only the registration entry point. The first business feature (specified in its own PRD) adds a feature folder, following the conventions below.

Each module exposes one registration method (`AddModuleTemplate`), which registers its FluentValidation validators from the module assembly (none yet) and is where services and repositories are registered. `Program.cs` calls it and adds the module assembly as an MVC application part so its controllers are routed.

## Patterns (guidance for the first feature)

The building blocks below exist in code (`Repository<T>`, `IUnitOfWork`, the exception handler, the validation filter). No concrete feature uses them yet; the first business feature proves the full flow.

**Controller.** Binds the request, calls one service method, maps the result to a status code. No validation or business code.

**Service.** Business rules. Throws `NotFoundException` for missing resources and saves through `IUnitOfWork`.

**Repository.** Derives from `Repository<T>` (`GetByIdAsync`, `ListAsync`, `Add`, `Remove`). Repositories stage changes and never call `SaveChanges`.

**Unit of work.** `IUnitOfWork.SaveChangesAsync` commits staged changes in one database transaction. `ExecuteInTransactionAsync` wraps several operations in an explicit transaction and rolls back on error.

**Mapping.** DTO to entity is manual. No mapping library.

## API

The host exposes no business endpoints yet. Controllers return RFC 7807 problem details for errors (see Validation and exception handling). Swagger UI is at `/swagger` in every environment except Production.

## Database integration

- Oracle through `Oracle.EntityFrameworkCore` 9.x (matches EF Core 9).
- Entity mappings are Fluent API classes in `iErp.Data/Configurations`, discovered by `AppDbContext`.
- The target database is Oracle 10.2, which the provider does not officially support. `Oracle10gCompatibilityInterceptor` (registered in `AddData` and the design-time factory) normalizes line endings in provider-generated PL/SQL to LF and rewrites `FETCH FIRST n ROWS ONLY` to a `ROWNUM` wrapper. OFFSET paging is not supported. New features must be verified against 10g.
- Table and column names are explicit and upper-case (for example `ORDERS`, `IS_ACTIVE`).
- Guid keys map to `RAW(16)` and are generated in code. Booleans map to `NUMBER(1)` so the schema also works on Oracle versions before 23ai.
- Connection string: `ConnectionStrings:Default`, from (lowest to highest priority) `appsettings*.json`, the optional Git-ignored `appsettings.{Environment}.local.json` (copy `appsettings.Development.local.example.json`), user secrets, and the `ConnectionStrings__Default` environment variable, which always wins. Startup fails with a clear message when it is missing. No secrets are committed.
- Migrations live in `iErp.Data/Migrations`. A design-time factory lets `dotnet ef` generate migrations without a database.

## Validation and exception handling

- `ValidationFilter` runs the FluentValidation validator for each action argument and returns 400 with `ValidationProblemDetails` (errors grouped by field).
- `GlobalExceptionHandler` maps `NotFoundException` to 404 and everything else to a generic 500. All errors are RFC 7807 problem details with a `traceId`. Exception details are logged, never returned.

## Logging and configuration

Serilog (console sink) configured from `appsettings`, plus request logging. `appsettings.{Development,Testing,Production}.json` override the base file.

## Testing

xUnit, in `iErp.Tests`:

- `Unit/`: the Oracle 10g compatibility interceptor. No database.
- `Integration/PipelineTests`: the real HTTP pipeline through test-only endpoints (`TestSupport/TestEndpointsController`, never part of the shipped API): 404 problem details, 500 without internal details, 400 with errors grouped by field, Swagger. No database.
- `Integration/OracleConnectivityTests`: connects to Oracle. Skipped unless `IERP_TEST_ORACLE` holds a connection string for a test schema.
- `Architecture/`: dependency rules, plus a check that the Api and module assemblies do not use test code.

## Adding a module

1. Create `iErp.<Name>` directly under `backend/` referencing only the projects allowed in the table above, and add it to `iErp.sln`.
2. Add entities to `iErp.Entities`, their configuration to `iErp.Data/Configurations`, then a migration.
3. Add `Add<Name>(IServiceCollection)` that registers its services, repositories and validators.
4. In `iErp.Api`: reference the project, call the registration method, and add its assembly as an application part.
5. Add unit tests and extend the architecture tests if the module introduces new rules.

## Adding a feature to a module

Create a feature folder with controller, service, repository, DTOs and validator, following the conventions above. Register the service, repository and validator in the module's registration method.
