using System.Net;
using LearnEnglish.Application.UserData;
using LearnEnglish.Functions.Options;
using LearnEnglish.Functions.Shared;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LearnEnglish.Functions.Functions;

public sealed class SettingsFunctions(
    IUserDataService userDataService,
    IOptions<AppDataOptions> appDataOptions,
    ILogger<SettingsFunctions> logger
)
{
    [Function("GetSettings")]
    public async Task<HttpResponseData> Get(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/settings")]
            HttpRequestData request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var settings = await userDataService.GetSettingsAsync(
                FunctionHttp.ResolveUserId(appDataOptions),
                cancellationToken
            );
            return await FunctionHttp.JsonAsync(request, HttpStatusCode.OK, settings, cancellationToken);
        }
        catch (Exception exception)
        {
            return await FunctionHttp.HandleExceptionAsync(
                request,
                exception,
                logger,
                cancellationToken
            );
        }
    }

    [Function("PutSettings")]
    public async Task<HttpResponseData> Put(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "v1/settings")]
            HttpRequestData request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var payload = await FunctionHttp.ReadJsonAsync<SettingsData>(request, cancellationToken);
            await userDataService.SaveSettingsAsync(
                FunctionHttp.ResolveUserId(appDataOptions),
                payload,
                cancellationToken
            );
            return FunctionHttp.NoContent(request);
        }
        catch (Exception exception)
        {
            return await FunctionHttp.HandleExceptionAsync(
                request,
                exception,
                logger,
                cancellationToken
            );
        }
    }
}
