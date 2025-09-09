using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace profiles.Dtos.Entreprise
{
    public class ResponsableDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Lastname { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Phone { get; set; }
    }
}