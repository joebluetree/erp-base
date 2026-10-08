using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace iErp.Shared;

public static class ApiProblem
{
    public static ProblemDetails Create(HttpContext context, int status, string title, string? detail = null)
    {
        var problem = new ProblemDetails { Status = status, Title = title, Detail = detail };
        problem.Extensions["traceId"] = context.TraceIdentifier;
        return problem;
    }

    public static ValidationProblemDetails Validation(HttpContext context, IDictionary<string, string[]> errors)
    {
        var problem = new ValidationProblemDetails(errors)
        {
            Status = StatusCodes.Status400BadRequest,
            Title = "One or more validation errors occurred."
        };
        problem.Extensions["traceId"] = context.TraceIdentifier;
        return problem;
    }
}
