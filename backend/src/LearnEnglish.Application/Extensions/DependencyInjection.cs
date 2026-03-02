using LearnEnglish.Application.Abstractions;
using LearnEnglish.Application.Examples;
using Microsoft.Extensions.DependencyInjection;

namespace LearnEnglish.Application.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IExampleGenerationService, ExampleGenerationService>();
        return services;
    }
}
