using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace profiles.Dtos
{
    public class UserStatusDto
    {
        public required string Code { get; set; }
        public required string Severity { get; set; }
    }
}