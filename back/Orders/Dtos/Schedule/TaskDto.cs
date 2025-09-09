using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orders.Dtos.Schedule
{
    public class TaskDto
    {
        public required string Title { get; set; }
        public required DateTime StartHour { get; set; }
        public required DateTime EndHour { get; set; }
        public string? Description { get; set; }
    }
}