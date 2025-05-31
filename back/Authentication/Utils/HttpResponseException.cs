using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Authentication.Utils
{
    public class HttpResponseException : Exception
    {
        public int Status { get; set; } = StatusCodes.Status500InternalServerError;

        public object Value { get; set; }

        public HttpResponseException(string message) : base(message)
        {
            this.Value = new ProblemDetails
            {
                Status = Status,
                Instance = (this.TargetSite != null) ? this.TargetSite.Name : "",
                Title = message ?? "An error occurred.",
                Detail = message,
            };
        }


        public HttpResponseException(int errorCode, string message) : base(message)
        {
            this.Status = errorCode;
            this.Value = new ProblemDetails
            {
                Status = errorCode,
                Instance = (this.TargetSite != null) ? this.TargetSite.Name : "",
                Title = message ?? "An error occurred.",
                Detail = message,
            };
        }

        public HttpResponseException(string message, Exception innerException) : base(message, innerException)
        {
            this.Value = new ProblemDetails
            {
                Status = Status,
                Instance = (this.TargetSite != null) ? this.TargetSite.Name : "",
                Title = message ?? "An error occurred.",
                Detail = message,
            };
        }

        protected HttpResponseException(System.Runtime.Serialization.SerializationInfo serializationInfo, System.Runtime.Serialization.StreamingContext streamingContext)
        {
            throw new NotImplementedException();
        }
    
    }
}