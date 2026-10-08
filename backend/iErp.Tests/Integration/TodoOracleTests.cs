using System.Net;
using System.Net.Http.Json;
using iErp.ModuleTemplate.Todos;

namespace iErp.Tests.Integration;

/// <summary>End-to-end against a real Oracle test schema. Skipped unless IERP_TEST_ORACLE is set.</summary>
public class TodoOracleTests
{
    [OracleFact]
    public async Task Todo_crud_round_trip()
    {
        using var client = new ApiFactory().CreateClient();

        var create = await client.PostAsJsonAsync("/api/todos", new { title = "integration", description = "d" });
        Assert.Equal(HttpStatusCode.Created, create.StatusCode);
        var created = (await create.Content.ReadFromJsonAsync<TodoResponse>())!;

        var update = await client.PostAsJsonAsync("/api/todos", new { id = created.Id, title = "changed", isCompleted = true });
        Assert.Equal(HttpStatusCode.OK, update.StatusCode);

        var fetched = (await client.GetFromJsonAsync<TodoResponse>($"/api/todos/{created.Id}"))!;
        Assert.Equal("changed", fetched.Title);
        Assert.True(fetched.IsCompleted);

        var list = (await client.GetFromJsonAsync<List<TodoResponse>>("/api/todos"))!;
        Assert.Contains(list, t => t.Id == created.Id);

        Assert.Equal(HttpStatusCode.NoContent, (await client.DeleteAsync($"/api/todos/{created.Id}")).StatusCode);
        Assert.Equal(HttpStatusCode.NotFound, (await client.GetAsync($"/api/todos/{created.Id}")).StatusCode);
    }
}
