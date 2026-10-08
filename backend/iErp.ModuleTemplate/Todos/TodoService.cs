using iErp.Data.Repositories;
using iErp.Entities.Todos;
using iErp.Shared.Exceptions;

namespace iErp.ModuleTemplate.Todos;

public interface ITodoService
{
    Task<IReadOnlyList<TodoResponse>> ListAsync(CancellationToken ct = default);
    Task<TodoResponse> GetAsync(Guid id, CancellationToken ct = default);
    /// <summary>Creates when <c>Id</c> is null, otherwise updates. <c>Created</c> tells which happened.</summary>
    Task<(TodoResponse Todo, bool Created)> SaveAsync(TodoSaveRequest request, CancellationToken ct = default);
    Task DeleteAsync(Guid id, CancellationToken ct = default);
}

public class TodoService(ITodoRepository repository, IUnitOfWork unitOfWork) : ITodoService
{
    public async Task<IReadOnlyList<TodoResponse>> ListAsync(CancellationToken ct = default)
        => (await repository.ListAsync(ct)).Select(x => x.ToResponse()).ToList();

    public async Task<TodoResponse> GetAsync(Guid id, CancellationToken ct = default)
        => (await repository.GetByIdAsync(id, ct) ?? throw new NotFoundException(nameof(TodoItem), id)).ToResponse();

    public async Task<(TodoResponse Todo, bool Created)> SaveAsync(TodoSaveRequest request, CancellationToken ct = default)
    {
        TodoItem entity;
        var created = request.Id is null;
        if (created)
        {
            entity = new TodoItem { Id = Guid.NewGuid() };
            repository.Add(entity);
        }
        else
        {
            entity = await repository.GetByIdAsync(request.Id!.Value, ct)
                ?? throw new NotFoundException(nameof(TodoItem), request.Id.Value);
        }

        entity.Apply(request);
        await unitOfWork.SaveChangesAsync(ct);
        return (entity.ToResponse(), created);
    }

    public async Task DeleteAsync(Guid id, CancellationToken ct = default)
    {
        var entity = await repository.GetByIdAsync(id, ct) ?? throw new NotFoundException(nameof(TodoItem), id);
        repository.Remove(entity);
        await unitOfWork.SaveChangesAsync(ct);
    }
}
