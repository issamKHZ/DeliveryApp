using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace profiles.Midlewares
{
    public class ExceptionsMidleware
    {
        private readonly RequestDelegate _next;

        public ExceptionsMidleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(httpContext, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            HttpStatusCode code;
            string errorMessage = exception.Message;

            switch (exception)
            {
                case HttpRequestException httpEx:
                    code = httpEx.StatusCode ?? HttpStatusCode.InternalServerError;
                    break;

                case ValidationException validationEx:
                    code = HttpStatusCode.BadRequest;
                    errorMessage = validationEx.Message;
                    break;

                case KeyNotFoundException notFoundEx:
                    code = HttpStatusCode.NotFound;
                    errorMessage = notFoundEx.Message;
                    break;

                default:
                    // Par défaut, une erreur 500
                    code = HttpStatusCode.InternalServerError;
                    break;
            }

            var result = JsonConvert.SerializeObject(new
            {
                status = (int)code,
                error = errorMessage,
                type = exception.GetType().Name
            });

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;

            return context.Response.WriteAsync(result);
        }

    }
}