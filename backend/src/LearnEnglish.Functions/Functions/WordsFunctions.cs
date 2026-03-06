using System.Net;
using LearnEnglish.Application.UserData;
using LearnEnglish.Functions.Options;
using LearnEnglish.Functions.Shared;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LearnEnglish.Functions.Functions;

public sealed class WordsFunctions(
    IUserDataService userDataService,
    IOptions<AppDataOptions> appDataOptions,
    ILogger<WordsFunctions> logger
)
{
    [Function("GetWords")]
    public async Task<HttpResponseData> Get(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/words")]
            HttpRequestData request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var words = await userDataService.GetWordsAsync(
                FunctionHttp.ResolveUserId(appDataOptions),
                cancellationToken
            );
            return await FunctionHttp.JsonAsync(request, HttpStatusCode.OK, words, cancellationToken);
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

    [Function("PutWords")]
    public async Task<HttpResponseData> Put(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "v1/words")]
            HttpRequestData request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var payload = await FunctionHttp.ReadJsonAsync<List<WordData>>(request, cancellationToken);
            await userDataService.SaveWordsAsync(
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
