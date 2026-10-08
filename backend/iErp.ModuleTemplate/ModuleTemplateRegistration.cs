using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace iErp.ModuleTemplate;

/// <summary>
/// The module skeleton's registration entry point. A module registers its services, repositories and
/// validators here, and Api calls it once. This template contains no feature yet.
/// </summary>
public static class ModuleTemplateRegistration
{
    public static IServiceCollection AddModuleTemplate(this IServiceCollection services)
    {
        services.AddValidatorsFromAssemblyContaining(typeof(ModuleTemplateRegistration));
        return services;
    }
}
