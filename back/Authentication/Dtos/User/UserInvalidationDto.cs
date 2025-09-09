using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Dtos.User
{
    public class UserInvalidationDto
    {        
        public required string Email { get; set; }
        public required string Fullname { get; set; }
        public required string Role { get; set; }
    }
}