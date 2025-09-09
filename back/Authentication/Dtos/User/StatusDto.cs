using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Dtos.User
{
    public class StatusDto
    {
        public required string Code { get; set; }
        public required string Severity { get; set; }
    }
}