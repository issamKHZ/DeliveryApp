using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Dtos
{
    public class ResetPwdDto
    {
        public required string ResetToken { get; set; }
        public required string password { get; set; }
    }
}