using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Dtos
{
    public class UserInfosSubscibedDto
    {
        public required string ID { get; set; }
        public string? Name { get; set; }
        public string? PhoneNumber { get; set; }    
        public string? Role { get; set; } 
    }
}