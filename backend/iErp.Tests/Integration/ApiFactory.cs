using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using iErp.ModuleTemplate.Todos;

namespace iErp.Tests.Integration;

public static class OracleTest
{
    public const string EnvVar = "IERP_TEST_ORACLE";
    public static string? ConnectionString => Environment.GetEnvironmentVariable(EnvVar);
}

public sealed class OracleFactAttribute : FactAttribute
{
    public OracleFactAttribute()
    {
        if (string.IsNullOrWhiteSpace(OracleTest.ConnectionString))
            Skip = $"Set {OracleTest.EnvVar} to a connection string for an Oracle test schema (migrations applied).";
    }
}

/// <summary>Real pipeline; connection string from IERP_TEST_ORACLE, or a placeholder when only a fake service is used.</summary>
public class ApiFactory(ITodoService? fakeService = null) : WebApplicationFactory<Program>
{
    // Program reads the connection string while building, before ConfigureAppConfiguration applies,
    // so it is supplied through the environment (the same way a deployment would).
    static ApiFactory() => Environment.SetEnvironmentVariable("ConnectionStrings__Default",
        OracleTest.ConnectionString ?? "User Id=x;Password=x;Data Source=localhost:1521/none");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Testing");
        if (fakeService is not null)
            builder.ConfigureServices(s =>
            {
                s.RemoveAll<ITodoService>();
                s.AddSingleton(fakeService);
            });
    }
}
