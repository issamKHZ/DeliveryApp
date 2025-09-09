using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orders.Dtos.Schedule
{
    public class ScheduleTime
    {
        public required int Month { get; set; }
        public required int Year { get; set; }
        public required string LivreurID { get; set; }
    }
}