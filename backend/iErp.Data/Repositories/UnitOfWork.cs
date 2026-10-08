namespace iErp.Data.Repositories;

public class UnitOfWork(AppDbContext db) : IUnitOfWork
{
    public Task<int> SaveChangesAsync(CancellationToken ct = default) => db.SaveChangesAsync(ct);

    public async Task ExecuteInTransactionAsync(Func<CancellationToken, Task> action, CancellationToken ct = default)
    {
        // The Oracle provider's retry strategy is not enabled, so a manual transaction is safe here.
        await using var tx = await db.Database.BeginTransactionAsync(ct);
        await action(ct);
        await db.SaveChangesAsync(ct);
        await tx.CommitAsync(ct);
    }
}
