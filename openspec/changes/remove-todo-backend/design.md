# Design

## Context

`backend/` is a .NET 9 modular monolith on Oracle 10g (through the provider with `Oracle10gCompatibilityInterceptor`). The Todo feature lives in `iErp.ModuleTemplate/Todos` (controller, service, repository, DTOs, validator), `iErp.Entities/Todos/TodoItem`, `iErp.Data/Configurations/TodoItemConfiguration` and the `TodoItems` set on `AppDbContext`. `InitialCreate` creates `TODO_ITEMS`. Tests: `TodoServiceTests`, `TodoSaveRequestValidatorTests`, `TodoPipelineTests` (fake service through the real pipeline), `TodoOracleTests` (CRUD against Oracle), plus architecture tests that reference `TodoItem` to find the Entities assembly. See proposal.md.

## Goals / Non-Goals

**Goals:**
- Remove every Todo type, test and mapping, leaving a building, tested foundation.
- Keep test coverage of the HTTP pipeline and Oracle connectivity, which Todo used to provide.

**Non-Goals:**
- Replacing Todo with another sample; changing the architecture patterns; touching the frontend.

## Decisions

**What stays.** `Repository<T>`, `IRepository<T>`, `IUnitOfWork`/`UnitOfWork`, `AppDbContext` (with no sets), `AddData`, the Oracle 10g interceptor, `NotFoundException`, `ApiProblem`, the exception handler, the validation filter, Serilog and Swagger. `ModuleTemplateRegistration.AddModuleTemplate` stays and registers FluentValidation validators from the module assembly (none yet), so a module author sees the convention.

**Entities anchor.** `iErp.Entities` would have no types. Add a public `EntitiesMarker` class, like `SharedBusinessMarker`, so the architecture tests can still load the assembly.

**Migration.** Remove the entity and configuration, then generate `RemoveTodoItems` with `dotnet ef migrations add`, which drops `TODO_ITEMS` and leaves an empty model snapshot. The migration is generated now and applied separately, after the user confirms, because it deletes data. Alternative: delete `InitialCreate` and start a fresh migration history, rejected because a database that already applied `InitialCreate` (such as the development schema) would then be out of step.

**Replacement tests, without a business feature.**
- Pipeline tests keep using `WebApplicationFactory<Program>`. A test-only controller (`TestEndpointsController` under `iErp.Tests`, added to the host as an application part by the test factory) exposes routes that throw `NotFoundException`, throw an unexpected exception containing a secret string, and accept a body validated by a test-only FluentValidation validator. The tests assert 404 problem details with a trace id, 500 with no internal detail, and 400 with errors grouped by field, plus that Swagger JSON is served outside Production.
- An Oracle connectivity test (skipped unless `IERP_TEST_ORACLE` is set) opens the context and checks `Database.CanConnectAsync()`.
- Unit tests keep `Oracle10gCompatibilityInterceptorTests`. The Todo service and validator tests are deleted.
- Architecture tests are unchanged except that they find the Entities assembly through `EntitiesMarker`.

**Docs.** `kb/architecture/backend.md` drops the Todo feature walk-through and keeps the pattern descriptions as guidance for the first business feature; `backend/README.md` loses Todo mentions.

## Risks / Trade-offs

- [Dropping `TODO_ITEMS` deletes data] → The migration is generated but not applied by this change's code tasks; applying it needs separate user confirmation, and the schema is a shared development database.
- [The foundation loses its only example of the controller/service/repository flow] → The patterns stay documented in the architecture doc, and the first feature PRD re-establishes a working example.
- [A test-only controller could be mistaken for product code] → It lives in the test project only, and an architecture test asserts the Api and ModuleTemplate assemblies contain no type from the test namespace.
- [The frontend still calls `/api/todos` until its own removal is applied] → Apply the frontend removal in the same session.
