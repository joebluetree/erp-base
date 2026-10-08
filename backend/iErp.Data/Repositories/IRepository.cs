namespace iErp.Data.Repositories;

/// <summary>Repositories stage changes only; saving is done through <see cref="IUnitOfWork"/>.</summary>
public interface IRepository<T> where T : class
{
    Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default);
    Task<IReadOnlyList<T>> ListAsync(CancellationToken ct = default);
    void Add(T entity);
    void Remove(T entity);
}
