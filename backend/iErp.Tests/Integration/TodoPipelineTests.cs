using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using NSubstitute;
using NSubstitute.ExceptionExtensions;
using iErp.ModuleTemplate.Todos;
using iErp.Shared.Exceptions;

namespace iErp.Tests.Integration;

/// <summary>HTTP pipeline behaviour (routing, validation, error format) with a fake service. No Oracle needed.</summary>
public class TodoPipelineTests
{
    private readonly ITodoService _service = Substitute.For<ITodoService>();

    private HttpClient Client() => new ApiFactory(_service).CreateClient();

    [Fact]
    public async Task Invalid_title_returns_400_grouped_by_field_and_stores_nothing()
    {
        var response = await Client().PostAsJsonAsync("/api/todos", new { title = "" });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.True(body.GetProperty("errors").TryGetProperty("Title", out _));
        await _service.DidNotReceiveWithAnyArgs().SaveAsync(default!, default);
    }

    [Fact]
    public async Task Create_returns_201()
    {
        var todo = new TodoResponse(Guid.NewGuid(), "a", null, false);
        _service.SaveAsync(Arg.Any<TodoSaveRequest>(), Arg.Any<CancellationToken>()).Returns((todo, true));

        var response = await Client().PostAsJsonAsync("/api/todos", new { title = "a" });

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
    }

    [Fact]
    public async Task Update_returns_200()
    {
        var todo = new TodoResponse(Guid.NewGuid(), "a", null, true);
        _service.SaveAsync(Arg.Any<TodoSaveRequest>(), Arg.Any<CancellationToken>()).Returns((todo, false));

        var response = await Client().PostAsJsonAsync("/api/todos", new { id = todo.Id, title = "a", isCompleted = true });

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Not_found_returns_404_problem_details()
    {
        _service.GetAsync(Arg.Any<Guid>(), Arg.Any<CancellationToken>()).Throws(new NotFoundException("TodoItem", Guid.Empty));

        var response = await Client().GetAsync($"/api/todos/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal(404, body.GetProperty("status").GetInt32());
        Assert.True(body.TryGetProperty("traceId", out _));
    }

    [Fact]
    public async Task Unhandled_exception_returns_generic_500_without_internal_details()
    {
        _service.ListAsync(Arg.Any<CancellationToken>()).Throws(new InvalidOperationException("secret connection detail"));

        var response = await Client().GetAsync("/api/todos");

        Assert.Equal(HttpStatusCode.InternalServerError, response.StatusCode);
        var text = await response.Content.ReadAsStringAsync();
        Assert.DoesNotContain("secret connection detail", text);
        Assert.Contains("traceId", text);
    }

    [Fact]
    public async Task Delete_returns_204()
    {
        var response = await Client().DeleteAsync($"/api/todos/{Guid.NewGuid()}");
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }

    [Fact]
    public async Task Swagger_lists_todo_endpoints_outside_production()
    {
        var json = await Client().GetStringAsync("/swagger/v1/swagger.json");
        Assert.Contains("/api/todos", json);
    }
}
