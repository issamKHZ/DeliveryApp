using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authentication.Enum;

namespace Authentication.Dtos.User
{
    public class LoginResultDto
    {
        public required string Token { get; set; }
        public required Roles Role { get; set; }
    }
}