using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using iErp.Shared;

namespace iErp.Api.Middleware;

/// <summary>Runs the FluentValidation validator for each action argument and short-circuits with a 400.</summary>
public class ValidationFilter(IServiceProvider services) : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var errors = new Dictionary<string, List<string>>();
        foreach (var argument in context.ActionArguments.Values.Where(a => a is not null))
        {
            var validatorType = typeof(IValidator<>).MakeGenericType(argument!.GetType());
            if (services.GetService(validatorType) is not IValidator validator) continue;

            var result = await validator.ValidateAsync(
                new ValidationContext<object>(argument), context.HttpContext.RequestAborted);
            foreach (var failure in result.Errors)
            {
                if (!errors.TryGetValue(failure.PropertyName, out var list))
                    errors[failure.PropertyName] = list = [];
                list.Add(failure.ErrorMessage);
            }
        }

        if (errors.Count > 0)
        {
            var problem = ApiProblem.Validation(
                context.HttpContext, errors.ToDictionary(e => e.Key, e => e.Value.ToArray()));
            context.Result = new BadRequestObjectResult(problem);
            return;
        }

        await next();
    }
}
