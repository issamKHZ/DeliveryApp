using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace profiles.Dtos
{
    public class UserInfosPublishedDto
    {
        public required string ID { get; set; }
        public string? Name { get; set; }
        public string? PhoneNumber { get; set; }    
        public string? Role { get; set; }    
    }
}