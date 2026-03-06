using System.Net;
using LearnEnglish.Application.UserData;
using LearnEnglish.Functions.Options;
using LearnEnglish.Functions.Shared;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace LearnEnglish.Functions.Functions;

public sealed class NotesFunctions(
    IUserDataService userDataService,
    IOptions<AppDataOptions> appDataOptions,
    ILogger<NotesFunctions> logger
)
{
    [Function("GetNotes")]
    public async Task<HttpResponseData> Get(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/notes")]
            HttpRequestData request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var notes = await userDataService.GetNotesAsync(
                FunctionHttp.ResolveUserId(appDataOptions),
                cancellationToken
            );
            return await FunctionHttp.JsonAsync(request, HttpStatusCode.OK, notes, cancellationToken);
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

    [Function("PutNotes")]
    public async Task<HttpResponseData> Put(
        [HttpTrigger(AuthorizationLevel.Anonymous, "put", Route = "v1/notes")]
            HttpRequestData request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var payload = await FunctionHttp.ReadJsonAsync<List<StudyNoteData>>(request, cancellationToken);
            await userDataService.SaveNotesAsync(
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
