using Microsoft.EntityFrameworkCore;

namespace iErp.Data.Repositories;

public abstract class Repository<T>(AppDbContext db) : IRepository<T> where T : class
{
    protected AppDbContext Db { get; } = db;

    public async Task<T?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await Db.Set<T>().FindAsync([id], ct);

    public async Task<IReadOnlyList<T>> ListAsync(CancellationToken ct = default)
        => await Db.Set<T>().AsNoTracking().ToListAsync(ct);

    public void Add(T entity) => Db.Set<T>().Add(entity);

    public void Remove(T entity) => Db.Set<T>().Remove(entity);
}
