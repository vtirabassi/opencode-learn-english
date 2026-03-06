using System.Net;
using System.Text.Json;
using LearnEnglish.Application.Auth;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

namespace LearnEnglish.Functions.Shared;

internal static class FunctionHttp
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    };

    public static async Task<AuthUser> RequireAuthenticatedUserAsync(
        HttpRequestData request,
        IAuthService authService,
        CancellationToken cancellationToken
    )
    {
        if (!request.Headers.TryGetValues("Authorization", out var values))
        {
            throw new UnauthorizedAccessException("Authentication is required.");
        }

        var authorization = values.FirstOrDefault();
        if (string.IsNullOrWhiteSpace(authorization))
        {
            throw new UnauthorizedAccessException("Authentication is required.");
        }

        const string bearerPrefix = "Bearer ";
        if (!authorization.StartsWith(bearerPrefix, StringComparison.OrdinalIgnoreCase))
        {
            throw new UnauthorizedAccessException("Authentication is required.");
        }

        var token = authorization[bearerPrefix.Length..].Trim();
        if (string.IsNullOrWhiteSpace(token))
        {
            throw new UnauthorizedAccessException("Authentication is required.");
        }

        return await authService.GetCurrentUserAsync(token, cancellationToken);
    }

    public static async Task<T> ReadJsonAsync<T>(HttpRequestData request, CancellationToken cancellationToken)
    {
        try
        {
            var payload = await JsonSerializer.DeserializeAsync<T>(
                request.Body,
                JsonOptions,
                cancellationToken
            );

            if (payload is null)
            {
                throw new ArgumentException("Request body is required.");
            }

            return payload;
        }
        catch (JsonException exception)
        {
            throw new ArgumentException("Invalid JSON payload.", exception);
        }
    }

    public static async Task<HttpResponseData> JsonAsync(
        HttpRequestData request,
        HttpStatusCode statusCode,
        object payload,
        CancellationToken cancellationToken
    )
    {
        var response = request.CreateResponse(statusCode);
        response.Headers.Add("Content-Type", "application/json; charset=utf-8");

        var json = JsonSerializer.Serialize(payload, JsonOptions);
        await response.WriteStringAsync(json, cancellationToken);

        return response;
    }

    public static HttpResponseData NoContent(HttpRequestData request)
    {
        return request.CreateResponse(HttpStatusCode.NoContent);
    }

    public static Task<HttpResponseData> HandleExceptionAsync(
        HttpRequestData request,
        Exception exception,
        ILogger logger,
        CancellationToken cancellationToken
    )
    {
        return exception switch
        {
            ArgumentException argEx => ProblemAsync(
                request,
                HttpStatusCode.BadRequest,
                argEx.Message,
                cancellationToken
            ),
            UnauthorizedAccessException unauthorizedAccessException => ProblemAsync(
                request,
                HttpStatusCode.Unauthorized,
                unauthorizedAccessException.Message,
                cancellationToken
            ),
            HttpRequestException httpRequestException => HandleUpstreamAsync(
                request,
                httpRequestException,
                logger,
                cancellationToken
            ),
            InvalidOperationException invalidOperationException => HandleInvalidOperationAsync(
                request,
                invalidOperationException,
                logger,
                cancellationToken
            ),
            _ => HandleUnhandledAsync(request, exception, logger, cancellationToken),
        };
    }

    private static Task<HttpResponseData> HandleUpstreamAsync(
        HttpRequestData request,
        HttpRequestException exception,
        ILogger logger,
        CancellationToken cancellationToken
    )
    {
        logger.LogError(exception, "Upstream request failed");
        return ProblemAsync(
            request,
            HttpStatusCode.BadGateway,
            "Failed to call upstream service.",
            cancellationToken
        );
    }

    private static Task<HttpResponseData> HandleInvalidOperationAsync(
        HttpRequestData request,
        InvalidOperationException exception,
        ILogger logger,
        CancellationToken cancellationToken
    )
    {
        logger.LogError(exception, "Operation failed");
        return ProblemAsync(
            request,
            HttpStatusCode.BadGateway,
            exception.Message,
            cancellationToken
        );
    }

    private static Task<HttpResponseData> HandleUnhandledAsync(
        HttpRequestData request,
        Exception exception,
        ILogger logger,
        CancellationToken cancellationToken
    )
    {
        logger.LogError(exception, "Unhandled exception");
        return ProblemAsync(
            request,
            HttpStatusCode.InternalServerError,
            "Internal server error.",
            cancellationToken
        );
    }

    private static Task<HttpResponseData> ProblemAsync(
        HttpRequestData request,
        HttpStatusCode statusCode,
        string message,
        CancellationToken cancellationToken
    )
    {
        var problem = new
        {
            status = (int)statusCode,
            title = "Request failed",
            detail = message,
        };
        return ProblemJsonAsync(request, statusCode, problem, cancellationToken);
    }

    private static async Task<HttpResponseData> ProblemJsonAsync(
        HttpRequestData request,
        HttpStatusCode statusCode,
        object payload,
        CancellationToken cancellationToken
    )
    {
        var response = request.CreateResponse(statusCode);
        response.Headers.Add("Content-Type", "application/problem+json; charset=utf-8");

        var json = JsonSerializer.Serialize(payload, JsonOptions);
        await response.WriteStringAsync(json, cancellationToken);

        return response;
    }
}
