using Microsoft.Extensions.DependencyInjection;
using iErp.Data;

namespace iErp.Tests.Integration;

/// <summary>Connects to a real Oracle test schema. Skipped unless IERP_TEST_ORACLE is set.</summary>
public class OracleConnectivityTests
{
    [OracleFact]
    public async Task Application_connects_to_oracle()
    {
        using var factory = new ApiFactory();
        using var scope = factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        Assert.True(await db.Database.CanConnectAsync());
    }
}
