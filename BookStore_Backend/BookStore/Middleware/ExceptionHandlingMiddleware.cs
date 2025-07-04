using System.Text.Json;
using BookStore.Core.Exceptions;

namespace BookStore.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unhandled exception");

                context.Response.ContentType = "application/json";

                if (ex is BusinessLogicException)
                {
                    context.Response.StatusCode = StatusCodes.Status400BadRequest;

                    var error = new
                    {
                        message = ex.Message
                    };

                    var json = JsonSerializer.Serialize(error, new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                    });

                    await context.Response.WriteAsync(json);
                }
                else
                {
                    context.Response.StatusCode = StatusCodes.Status500InternalServerError;

                    var error = new
                    {
                        message = "An unexpected error occurred. Please try again later."
                    };

                    var json = JsonSerializer.Serialize(error, new JsonSerializerOptions
                    {
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                    });

                    await context.Response.WriteAsync(json);
                }
            }
        }
    }
}
