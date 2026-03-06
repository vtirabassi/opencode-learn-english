using LearnEnglish.Application.Abstractions;
using LearnEnglish.Application.Auth;
using LearnEnglish.Application.UserData;
using LearnEnglish.Infrastructure.Auth;
using LearnEnglish.Infrastructure.OpenAi;
using LearnEnglish.Infrastructure.Options;
using LearnEnglish.Infrastructure.UserData;
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
        services.Configure<AzureBlobOptions>(configuration.GetSection(AzureBlobOptions.SectionName));
        services.Configure<AuthOptions>(configuration.GetSection(AuthOptions.SectionName));

        services.AddHttpClient<IOpenAiClient, OpenAiClient>((serviceProvider, client) =>
        {
            var options = serviceProvider
                .GetRequiredService<Microsoft.Extensions.Options.IOptions<OpenAiOptions>>()
                .Value;

            var baseUrl = options.BaseUrl.TrimEnd('/');
            client.BaseAddress = new Uri($"{baseUrl}/");
        });
        services.AddScoped<IUserDataStore, AzureBlobUserDataStore>();
        services.AddScoped<IUserAccountStore, AzureBlobUserAccountStore>();
        services.AddScoped<IAuthTokenService, JwtAuthTokenService>();

        return services;
    }
}
