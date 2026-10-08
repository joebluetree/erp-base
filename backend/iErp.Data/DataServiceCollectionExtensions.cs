using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using iErp.Data.Repositories;

namespace iErp.Data;

public static class DataServiceCollectionExtensions
{
    public const string ConnectionStringName = "Default";

    public static IServiceCollection AddData(this IServiceCollection services, IConfiguration configuration)
    {
        var connectionString = configuration.GetConnectionString(ConnectionStringName);
        if (string.IsNullOrWhiteSpace(connectionString))
            throw new InvalidOperationException(
                $"Connection string 'ConnectionStrings:{ConnectionStringName}' is not configured. " +
                "Set it with user secrets or the ConnectionStrings__Default environment variable.");

        services.AddDbContext<AppDbContext>(o => o.UseOracle(connectionString).AddInterceptors(new Oracle10gCompatibilityInterceptor()));
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        return services;
    }
}
