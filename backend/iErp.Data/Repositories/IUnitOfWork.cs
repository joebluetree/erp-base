namespace iErp.Data.Repositories;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);

    /// <summary>Runs the action and saves in one database transaction; rolls back if it throws.</summary>
    Task ExecuteInTransactionAsync(Func<CancellationToken, Task> action, CancellationToken ct = default);
}
