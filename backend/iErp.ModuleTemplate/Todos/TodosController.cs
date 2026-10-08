using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace iErp.ModuleTemplate.Todos;

[ApiController]
[Route("api/todos")]
public class TodosController(ITodoService service) : ControllerBase
{
    [HttpPost]
    [ProducesResponseType<TodoResponse>(StatusCodes.Status201Created)]
    [ProducesResponseType<TodoResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ValidationProblemDetails>(StatusCodes.Status400BadRequest)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TodoResponse>> Save(TodoSaveRequest request, CancellationToken ct)
    {
        var (todo, created) = await service.SaveAsync(request, ct);
        return created ? CreatedAtAction(nameof(Get), new { id = todo.Id }, todo) : Ok(todo);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType<TodoResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<TodoResponse>> Get(Guid id, CancellationToken ct)
        => await service.GetAsync(id, ct);

    [HttpGet]
    [ProducesResponseType<IReadOnlyList<TodoResponse>>(StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<TodoResponse>>> List(CancellationToken ct)
        => Ok(await service.ListAsync(ct));

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType<ProblemDetails>(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await service.DeleteAsync(id, ct);
        return NoContent();
    }
}
