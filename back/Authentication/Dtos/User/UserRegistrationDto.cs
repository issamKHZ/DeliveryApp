using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Authentication.Enum;

namespace Authentication.Dtos.User
{
    public class UserRegistrationDto
    {                
        public required string Name { get; set; }

        public required string Email { get; set; }

        public required string PhoneNumber { get; set; }

        public required string Password { get; set; }
        
        public required Roles Role { get; set; }
    }
}