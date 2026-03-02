using LearnEnglish.Application.Abstractions;
using LearnEnglish.Infrastructure.OpenAi;
using LearnEnglish.Infrastructure.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace LearnEnglish.Infrastructure.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.Configure<OpenAiOptions>(configuration.GetSection(OpenAiOptions.SectionName));

        services.AddHttpClient<IOpenAiClient, OpenAiClient>((serviceProvider, client) =>
        {
            var options = serviceProvider
                .GetRequiredService<Microsoft.Extensions.Options.IOptions<OpenAiOptions>>()
                .Value;

            var baseUrl = options.BaseUrl.TrimEnd('/');
            client.BaseAddress = new Uri($"{baseUrl}/");
        });

        return services;
    }
}
