using System.Net;
using LearnEnglish.Application.Auth;
using LearnEnglish.Functions.Contracts;
using LearnEnglish.Functions.Shared;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace LearnEnglish.Functions.Functions;

public sealed class AuthFunctions(
    IAuthService authService,
    ILogger<AuthFunctions> logger
)
{
    [Function("Register")]
    public async Task<HttpResponseData> Register(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "v1/auth/register")]
            HttpRequestData request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var payload = await FunctionHttp.ReadJsonAsync<AuthRequest>(request, cancellationToken);
            var response = await authService.RegisterAsync(
                payload.Email,
                payload.Password,
                cancellationToken
            );
            return await FunctionHttp.JsonAsync(
                request,
                HttpStatusCode.Created,
                response,
                cancellationToken
            );
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

    [Function("Login")]
    public async Task<HttpResponseData> Login(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "v1/auth/login")]
            HttpRequestData request,
        CancellationToken cancellationToken
    )
    {
        try
        {
            var payload = await FunctionHttp.ReadJsonAsync<AuthRequest>(request, cancellationToken);
            var response = await authService.LoginAsync(
                payload.Email,
                payload.Password,
                cancellationToken
            );
            return await FunctionHttp.JsonAsync(request, HttpStatusCode.OK, response, cancellationToken);
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

    [Function("Logout")]
    public HttpResponseData Logout(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "v1/auth/logout")]
            HttpRequestData request
    )
    {
        return FunctionHttp.NoContent(request);
    }

    [Function("GetCurrentUser")]
    public async Task<HttpResponseData> Me(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "v1/auth/me")]
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
            return await FunctionHttp.JsonAsync(request, HttpStatusCode.OK, user, cancellationToken);
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
