using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace iErp.Data;

/// <summary>Used by `dotnet ef` only. Generating migrations does not connect to the database.</summary>
public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__Default")
            ?? "User Id=design;Password=design;Data Source=localhost:1521/design";
        var options = new DbContextOptionsBuilder<AppDbContext>().UseOracle(connectionString).AddInterceptors(new Oracle10gCompatibilityInterceptor()).Options;
        return new AppDbContext(options);
    }
}
