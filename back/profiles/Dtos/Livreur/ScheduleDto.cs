using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using profiles.Enumerations;

namespace profiles.Dtos.Livreur
{
    public class ScheduleDto
    {
        public required string Day { get; set; }
        public DateTime? StartHour { get; set; }
        public DateTime? EndHour { get; set; } 
        public bool? Dispo { get; set; } 
    }
}