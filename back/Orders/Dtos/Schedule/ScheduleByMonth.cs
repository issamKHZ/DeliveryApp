using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orders.Dtos.Schedule
{
    public class ScheduleByMonth
    {
        public required int Day { get; set; }
        public required int Month { get; set; }
        public required int Year { get; set; }
        public required bool Disponibility { get; set; }
        public required ICollection<TaskDto> Livreur_Tasks { get; set; }
    }
}