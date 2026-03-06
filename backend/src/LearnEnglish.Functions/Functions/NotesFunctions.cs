using System.Net;
using LearnEnglish.Application.Auth;
using LearnEnglish.Application.UserData;
using LearnEnglish.Functions.Shared;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace LearnEnglish.Functions.Functions;

public sealed class NotesFunctions(
    IUserDataService userDataService,
    IAuthService authService,
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
            var user = await FunctionHttp.RequireAuthenticatedUserAsync(
                request,
                authService,
                cancellationToken
            );
            var note = await userDataService.GetNoteAsync(
                user.UserId,
                cancellationToken
            );
            return await FunctionHttp.JsonAsync(request, HttpStatusCode.OK, note, cancellationToken);
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
            var user = await FunctionHttp.RequireAuthenticatedUserAsync(
                request,
                authService,
                cancellationToken
            );
            var payload = await FunctionHttp.ReadJsonAsync<StudyNoteData>(request, cancellationToken);
            await userDataService.SaveNoteAsync(
                user.UserId,
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
