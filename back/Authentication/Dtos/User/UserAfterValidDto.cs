using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Dtos.User
{
    public class UserAfterValidDto
    {
        public required bool RedirectToLogin { get; set; }
        public string? Token { get; set; }
        public string? LoginToken { get; set; }
        public string? Message { get; set; }
    }
}