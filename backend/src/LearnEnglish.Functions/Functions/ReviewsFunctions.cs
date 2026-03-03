using System.Net;
using LearnEnglish.Application.UserData;
using LearnEnglish.Functions.Options;
using LearnEnglish.Functions.Shared;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LearnEnglish.Functions.Functions;

public sealed class ReviewsFunctions(
    IUserDataService userDataService,
    IOptions<AppDataOptions> appDataOptions,
    ILogger<ReviewsFunctions> logger
)
{
    [Function("GetReviews")]
    public async Task<HttpResponseData> Get(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/reviews")]
            HttpRequestData request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var reviews = await userDataService.GetReviewsAsync(
                FunctionHttp.ResolveUserId(appDataOptions),
                cancellationToken
            );
            return await FunctionHttp.JsonAsync(request, HttpStatusCode.OK, reviews, cancellationToken);
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

    [Function("PutReviews")]
    public async Task<HttpResponseData> Put(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "v1/reviews")]
            HttpRequestData request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var payload = await FunctionHttp.ReadJsonAsync<List<ReviewItemData>>(
                request,
                cancellationToken
            );
            await userDataService.SaveReviewsAsync(
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
