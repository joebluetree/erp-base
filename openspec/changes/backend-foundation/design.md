# Design

## Context

Greenfield: the repo contains only `kb/` and `openspec/`. Requirements are in `kb/platform/backend.md`; motivation in proposal.md. The .NET 9 SDK (9.0.318) is installed. Oracle availability for development is not yet confirmed.

## Goals / Non-Goals

**Goals:**
- A buildable, tested .NET 9 modular monolith under `backend/` that new modules can copy.
- One fully working reference feature exercising every layer.

**Non-Goals:**
- Anything in the PRD's "Out of Scope" list (auth, auditing, soft delete, caching, paging, versioning, CI/CD).
- Generic repository abstractions beyond what Todo needs; no AutoMapper/MediatR.

## Decisions

**Layout.** `backend/` contains `iErp.sln`, `Directory.Build.props`, `Directory.Packages.props` (central package management), and the seven project folders directly beneath it (no `src/` or `tests/`): `iErp.Api`, `iErp.Data`, `iErp.Entities`, `iErp.Shared`, `iErp.SharedBusiness`, `iErp.ModuleTemplate`, `iErp.Tests` (FR-013). The rename also covers root namespaces, the user-secrets id and migration namespaces.

**Dependency direction.** Entities ← Data ← Modules ← Api; Shared referenced by anyone; SharedBusiness references Entities and Shared. Modules use repositories that depend on `AppDbContext` from Data. Api references every module and Data only to register them. Alternative considered: module-owned DbContexts, rejected by the PRD (single `AppDbContext`).

**Module feature layout.** `ModuleTemplate/Todos/` holds `TodosController`, `ITodoService`/`TodoService`, `ITodoRepository`/`TodoRepository`, DTOs, `TodoSaveRequestValidator`. A static `ModuleTemplateRegistration.AddModuleTemplate(IServiceCollection)` registers them. Controllers live in the module and are discovered by `AddApplicationPart` in Api.

**Entity config location.** Because Data may only depend on Entities, the Todo entity lives in Entities and its `IEntityTypeConfiguration` lives in Data; `AppDbContext` applies configurations from its assembly. Alternative: configurations in each module with Api passing assemblies to the context. Rejected for the foundation: it adds wiring, and the PRD puts EF configuration in Data.

**Repository and Unit of Work.** `IRepository<T>` in Shared-free base inside Data offers `GetByIdAsync`, `ListAsync`, `Add`, `Remove`; `IUnitOfWork` exposes `SaveChangesAsync` and `ExecuteInTransactionAsync`. Repositories never call `SaveChanges`; services do through the unit of work. Both abstractions live in Data to keep Shared free of EF.

**Single Save.** `POST /api/todos` takes `TodoSaveRequest` (nullable `Id`). Service loads the entity when `Id` is set (404 if missing) else creates one; returns a flag so the controller answers 201 vs 200. Alternative: separate POST/PUT; rejected by FR-006.

**GUID on Oracle.** Map `Guid` keys to `RAW(16)` (Oracle EF provider default), generated client-side in the service (`Guid.NewGuid()`), so no database sequence is needed.

**Errors.** Services throw `NotFoundException` (in Shared); a global `IExceptionHandler` maps it to 404 and anything else to a generic 500, both as problem details with `traceId`. FluentValidation runs via a validation filter that returns `ValidationProblemDetails` (400) so controllers contain no validation code. Alternative: FluentValidation.AspNetCore auto-validation, deprecated, so avoided.

**Logging and config.** Serilog with console sink and request logging middleware. `appsettings.json` plus Development/Testing/Production overrides; connection string empty in committed files, supplied by user secrets or environment variable `ConnectionStrings__Default`. Swagger via Swashbuckle, enabled only outside Production.

**Testing.** xUnit; unit tests use Moq/NSubstitute-style fakes for the repository and unit of work. Integration tests use `WebApplicationFactory<Program>` against an Oracle test schema whose connection string comes from an environment variable; they are tagged by trait so they can be skipped when it is absent. Architecture tests use NetArchTest plus a csproj-reference check for project-level rules.

**Architecture doc.** Written last, from the implemented code, at `kb/architecture/backend.md`.

**Oracle 10g target.** The development database is Oracle 10.2.0.1 (Personal Edition), older than anything the Oracle EF provider supports. It runs through `Oracle10gCompatibilityInterceptor`: line endings in provider-generated PL/SQL are normalized to LF (10g rejects CR), and a trailing `FETCH FIRST n ROWS ONLY` becomes a `ROWNUM` wrapper. Booleans use `NUMBER(1)`. Paging (OFFSET) is not supported, which is already out of scope. Alternative: hand-written DDL and no migrations, rejected because migrations (FR-004) work with the interceptor.

## Risks / Trade-offs

- [No Oracle instance available for integration tests] → Trait-gate the tests, document setup, and say plainly if they were not run.
- [10g is unsupported by the provider; other generated SQL may fail] → Interceptor covers what the foundation uses; the Oracle integration test guards it; new features must be run against 10g.
- [Oracle EF provider version lags EF Core 9] → Pin the newest compatible Oracle.EntityFrameworkCore; verify at the first build before anything else is written.
- [Controllers in module assemblies need explicit registration] → Cover with an integration test that hits a Todo route.
- [Oracle identifier limits and uppercase naming] → Use explicit short table and column names in configuration.
- [Single DbContext couples modules at the Data project] → Accepted by the PRD; dependency rules limit the blast radius.

## Open Questions

