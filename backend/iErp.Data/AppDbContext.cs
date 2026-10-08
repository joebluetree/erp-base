using Microsoft.EntityFrameworkCore;

namespace iErp.Data;

/// <summary>
/// The single shared context. Add a <c>DbSet&lt;T&gt;</c> per entity and an <c>IEntityTypeConfiguration&lt;T&gt;</c>
/// class in this assembly; configurations are discovered automatically.
/// </summary>
public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
        => modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
}
