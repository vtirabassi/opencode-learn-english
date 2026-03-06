using System.Net;
using LearnEnglish.Application;
using LearnEnglish.Application.Abstractions;
using LearnEnglish.Functions.Contracts;
using LearnEnglish.Functions.Shared;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace LearnEnglish.Functions.Functions;

public sealed class ExamplesFunctions(
    IExampleGenerationService exampleGenerationService,
    ILogger<ExamplesFunctions> logger
)
{
    [Function("GenerateExamples")]
    public async Task<HttpResponseData> Generate(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "v1/examples/generate")]
            HttpRequestData request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var payload = await FunctionHttp.ReadJsonAsync<GenerateExamplesRequest>(
                request,
                cancellationToken
            );

            if (string.IsNullOrWhiteSpace(payload.Word))
            {
                throw new ArgumentException("Word is required");
            }

            var result = await exampleGenerationService.GenerateAsync(
                new GenerateExamplesInput(
                    payload.Word,
                    payload.Tone,
                    payload.Variations,
                    payload.IncludeTranslation
                ),
                cancellationToken
            );

            return await FunctionHttp.JsonAsync(request, HttpStatusCode.OK, result, cancellationToken);
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
