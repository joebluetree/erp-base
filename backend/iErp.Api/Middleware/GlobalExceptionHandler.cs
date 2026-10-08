using Microsoft.AspNetCore.Diagnostics;
using iErp.Shared;
using iErp.Shared.Exceptions;

namespace iErp.Api.Middleware;

public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken ct)
    {
        if (exception is OperationCanceledException && context.RequestAborted.IsCancellationRequested)
            return true; // client went away; nothing to send

        var problem = exception switch
        {
            NotFoundException e => ApiProblem.Create(context, StatusCodes.Status404NotFound, "Resource not found.", e.Message),
            _ => ApiProblem.Create(context, StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
        };

        if (problem.Status == StatusCodes.Status500InternalServerError)
            logger.LogError(exception, "Unhandled exception for {Method} {Path}", context.Request.Method, context.Request.Path);

        context.Response.StatusCode = problem.Status!.Value;
        await context.Response.WriteAsJsonAsync(problem, ct);
        return true;
    }
}
