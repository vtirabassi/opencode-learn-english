using Microsoft.AspNetCore.Mvc;

namespace LearnEnglish.Api.Extensions;

internal sealed class ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (ArgumentException exception)
        {
            await WriteErrorAsync(context, StatusCodes.Status400BadRequest, exception.Message);
        }
        catch (HttpRequestException exception)
        {
            logger.LogError(exception, "Upstream request failed");
            await WriteErrorAsync(context, StatusCodes.Status502BadGateway, "Failed to call upstream service.");
        }
        catch (InvalidOperationException exception)
        {
            logger.LogError(exception, "Operation failed");
            await WriteErrorAsync(context, StatusCodes.Status502BadGateway, exception.Message);
        }
        catch (Exception exception)
        {
            logger.LogError(exception, "Unhandled exception");
            await WriteErrorAsync(context, StatusCodes.Status500InternalServerError, "Internal server error.");
        }
    }

    private static async Task WriteErrorAsync(HttpContext context, int statusCode, string message)
    {
        context.Response.StatusCode = statusCode;
        context.Response.ContentType = "application/problem+json";
        var problem = new ProblemDetails
        {
            Status = statusCode,
            Title = "Request failed",
            Detail = message,
        };
        await context.Response.WriteAsJsonAsync(problem);
    }
}
