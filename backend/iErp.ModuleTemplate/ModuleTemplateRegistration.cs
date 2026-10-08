using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using iErp.ModuleTemplate.Todos;

namespace iErp.ModuleTemplate;

public static class ModuleTemplateRegistration
{
    public static IServiceCollection AddModuleTemplate(this IServiceCollection services)
    {
        services.AddScoped<ITodoRepository, TodoRepository>();
        services.AddScoped<ITodoService, TodoService>();
        services.AddValidatorsFromAssemblyContaining<TodoSaveRequestValidator>();
        return services;
    }
}
