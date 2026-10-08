using iErp.Entities.Todos;

namespace iErp.ModuleTemplate.Todos;

/// <param name="Id">Null creates a new todo; a value updates the existing todo.</param>
public record TodoSaveRequest(Guid? Id, string Title, string? Description, bool IsCompleted);

public record TodoResponse(Guid Id, string Title, string? Description, bool IsCompleted);

public static class TodoMapping
{
    public static TodoResponse ToResponse(this TodoItem e) => new(e.Id, e.Title, e.Description, e.IsCompleted);

    public static void Apply(this TodoItem e, TodoSaveRequest r)
    {
        e.Title = r.Title.Trim();
        e.Description = r.Description;
        e.IsCompleted = r.IsCompleted;
    }
}
