using LearnEnglish.Application.Abstractions;
using LearnEnglish.Application.Examples;
using LearnEnglish.Application.UserData;
using Microsoft.Extensions.DependencyInjection;

namespace LearnEnglish.Application.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IExampleGenerationService, ExampleGenerationService>();
        services.AddScoped<IUserDataService, UserDataService>();
        return services;
    }
}
