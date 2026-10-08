# Proposal

## Why

The ERP has no backend yet. Business modules will be delivered incrementally through separate PRDs, so they need a shared technical foundation first. Without one, each module would invent its own structure, data access, validation and error handling.

## What Changes

- Create a `backend/` folder at the repo root holding a new .NET 9 solution `iErp.sln` (greenfield; no existing code is affected).
- Add projects: `Api`, `Data`, `Entities`, `Shared`, `SharedBusiness`, `ModuleTemplate`, `Tests`, all directly under `backend/` (no `src/` or `tests/` subfolders) and named with the `iErp` prefix (FR-013).
- Establish a Modular Monolith: one class library per business module, each with its own DI registration, hosted by `Api`.
- Add Oracle + EF Core with a single shared `AppDbContext`, Fluent API configuration, GUID keys, and migrations.
- Implement the Controller → Service → Repository → `AppDbContext` flow with a minimal Unit of Work and manual DTO mapping.
- Deliver a reference Todo Items CRUD in `ModuleTemplate`, with a single `Save` operation for create and update.
- Add FluentValidation, centralized exception handling with a consistent error format, and Swagger/OpenAPI.
- Add structured logging, Development/Testing/Production configuration, central package management and shared build settings.
- Add xUnit unit, integration and architecture tests.
- Write `kb/architecture/backend.md` documenting the implemented design.

Out of scope (future PRDs): auth, multi-company, auditing, soft delete, caching, pagination/filtering, API versioning, CI/CD, and the rest of the PRD's exclusion list.

Assumptions recorded from `kb/platform/backend.md`:
- The PRD's acceptance criterion "Item Master CRUD" is treated as the Todo Items CRUD (FR-006 and Deliverables say Todo).
- The architecture document is `kb/architecture/backend.md` (FR-012), distinct from the PRD of the same name in `kb/platform/`. The PRD's mention of `ARCHITECTURE.md` is superseded by it.

## Capabilities

### New Capabilities
- `backend-solution-structure`: .NET 9 solution layout, project responsibilities, dependency rules, module registration, central package management, architecture tests.
- `backend-data-access`: Oracle/EF Core integration, shared `AppDbContext`, GUID key mapping, migrations, repository and Unit of Work patterns, connection configuration.
- `backend-api-host`: Api project host, REST/Swagger conventions, validation, centralized exception handling, logging and environment configuration.
- `todo-items`: reference CRUD feature in `ModuleTemplate` (save, get, list, delete).
- `backend-testing`: xUnit unit and integration test requirements.
- `backend-architecture-docs`: `kb/architecture/backend.md` content requirements.

### Modified Capabilities
<!-- None; openspec/specs is empty. -->

## Impact

- New code under `backend/` only. Nothing else in the repo changes besides the new `kb/architecture/backend.md`.
- New dependencies: Microsoft.AspNetCore (.NET 9), Oracle.EntityFrameworkCore, FluentValidation, Swashbuckle (or built-in OpenAPI), Serilog, xUnit, NetArchTest.
- Requires an Oracle database for development and integration tests; connection strings come from configuration or user secrets, never source.
