using NSubstitute;
using iErp.Data.Repositories;
using iErp.Entities.Todos;
using iErp.ModuleTemplate.Todos;
using iErp.Shared.Exceptions;

namespace iErp.Tests.Unit;

public class TodoServiceTests
{
    private readonly ITodoRepository _repository = Substitute.For<ITodoRepository>();
    private readonly IUnitOfWork _unitOfWork = Substitute.For<IUnitOfWork>();
    private readonly TodoService _service;

    public TodoServiceTests() => _service = new TodoService(_repository, _unitOfWork);

    [Fact]
    public async Task Save_without_id_creates_and_saves()
    {
        var (todo, created) = await _service.SaveAsync(new TodoSaveRequest(null, " Buy milk ", "2L", false));

        Assert.True(created);
        Assert.NotEqual(Guid.Empty, todo.Id);
        Assert.Equal("Buy milk", todo.Title);
        _repository.Received(1).Add(Arg.Is<TodoItem>(t => t != null && t.Id == todo.Id));
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Save_with_existing_id_updates()
    {
        var existing = new TodoItem { Id = Guid.NewGuid(), Title = "Old" };
        _repository.GetByIdAsync(existing.Id, Arg.Any<CancellationToken>()).Returns(existing);

        var (todo, created) = await _service.SaveAsync(new TodoSaveRequest(existing.Id, "New", null, true));

        Assert.False(created);
        Assert.Equal("New", existing.Title);
        Assert.True(todo.IsCompleted);
        _repository.DidNotReceive().Add(Arg.Any<TodoItem>());
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Save_with_unknown_id_throws_not_found()
    {
        await Assert.ThrowsAsync<NotFoundException>(
            () => _service.SaveAsync(new TodoSaveRequest(Guid.NewGuid(), "x", null, false)));
        await _unitOfWork.DidNotReceive().SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Get_unknown_throws_not_found()
        => await Assert.ThrowsAsync<NotFoundException>(() => _service.GetAsync(Guid.NewGuid()));

    [Fact]
    public async Task List_returns_all_items()
    {
        _repository.ListAsync(Arg.Any<CancellationToken>())
            .Returns([new TodoItem { Id = Guid.NewGuid(), Title = "a" }, new TodoItem { Id = Guid.NewGuid(), Title = "b" }]);

        Assert.Equal(2, (await _service.ListAsync()).Count);
    }

    [Fact]
    public async Task Delete_existing_removes_and_saves()
    {
        var existing = new TodoItem { Id = Guid.NewGuid(), Title = "x" };
        _repository.GetByIdAsync(existing.Id, Arg.Any<CancellationToken>()).Returns(existing);

        await _service.DeleteAsync(existing.Id);

        _repository.Received(1).Remove(existing);
        await _unitOfWork.Received(1).SaveChangesAsync(Arg.Any<CancellationToken>());
    }

    [Fact]
    public async Task Delete_unknown_throws_not_found()
        => await Assert.ThrowsAsync<NotFoundException>(() => _service.DeleteAsync(Guid.NewGuid()));
}
