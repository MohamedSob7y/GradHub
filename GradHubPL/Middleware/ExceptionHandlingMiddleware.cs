using GRadHubBLL.Exceptions;
using System.Net;
using System.Text.Json;

namespace GradHubPL.Middleware
{
    /// <summary>
    /// Global exception handling middleware that maps BLL exceptions to HTTP status codes.
    /// </summary>
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            object responseBody;
            int statusCode;

            switch (exception)
            {
                case NotFoundException notFound:
                    statusCode = (int)HttpStatusCode.NotFound;
                    responseBody = new { error = notFound.Message };
                    break;

                case ConflictException conflict:
                    statusCode = (int)HttpStatusCode.Conflict;
                    responseBody = new { error = conflict.Message };
                    break;

                case ForbiddenException forbidden:
                    statusCode = (int)HttpStatusCode.Forbidden;
                    responseBody = new { error = forbidden.Message };
                    break;

                case GRadHubBLL.Exceptions.ValidationException validation:
                    statusCode = (int)HttpStatusCode.BadRequest;
                    responseBody = new
                    {
                        error = "One or more validation errors occurred.",
                        errors = validation.Errors
                    };
                    break;

                default:
                    _logger.LogError(exception, "Unhandled exception caught by ExceptionHandlingMiddleware");
                    statusCode = (int)HttpStatusCode.InternalServerError;
                    responseBody = new { error = "An unexpected error occurred. Please try again later." };
                    break;
            }

            context.Response.StatusCode = statusCode;

            var json = JsonSerializer.Serialize(responseBody, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            });

            await context.Response.WriteAsync(json);
        }
    }
}
