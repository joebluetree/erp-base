# Backend

ASP.NET Core (.NET 9) modular monolith with Oracle and EF Core. Architecture: `kb/architecture/backend.md`.

## Setup

Requires the .NET 9 SDK, an Oracle database (10.2 or later; 10g is handled by a built-in compatibility interceptor), and `dotnet-ef` (`dotnet tool install -g dotnet-ef`).

```powershell
# Connection string: never commit it. Use user secrets...
dotnet user-secrets set "ConnectionStrings:Default" "User Id=app;Password=...;Data Source=localhost:1521/FREEPDB1" --project iErp.Api
# ...or an environment variable
$env:ConnectionStrings__Default = "User Id=app;Password=...;Data Source=localhost:1521/FREEPDB1"

# Apply migrations
dotnet ef database update -p iErp.Data -s iErp.Api

# Run (Swagger at /swagger in Development)
dotnet run --project iErp.Api

# Test. Integration tests run only when IERP_TEST_ORACLE is set to a connection string for a test schema.
dotnet test iErp.sln
```

## Adding a migration

```powershell
dotnet ef migrations add <Name> -p iErp.Data -s iErp.Api -o Migrations
```
