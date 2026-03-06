using System.Text.Json;
using Azure.Core.Serialization;
using LearnEnglish.Application.Extensions;
using LearnEnglish.Functions.Options;
using LearnEnglish.Infrastructure.Extensions;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var host = new HostBuilder()
    .ConfigureAppConfiguration((context, configurationBuilder) =>
    {
        configurationBuilder
            .AddJsonFile("appsettings.json", optional: true, reloadOnChange: false)
            .AddJsonFile($"appsettings.{context.HostingEnvironment.EnvironmentName}.json", optional: true, reloadOnChange: false)
            .AddEnvironmentVariables();
    })
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices((context, services) =>
    {
        services.AddApplication();
        services.AddInfrastructure(context.Configuration);
        services.Configure<AppDataOptions>(
            context.Configuration.GetSection(AppDataOptions.SectionName)
        );

        services.Configure<WorkerOptions>(options =>
        {
            options.Serializer = new JsonObjectSerializer(new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            });
        });
    })
    .Build();

host.Run();
