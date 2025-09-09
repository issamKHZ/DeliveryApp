using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orders.Dtos.Schedule
{
    public class ScheduleDto
    {
        public required string LivreurID { get; set; }
        public required ICollection<ScheduleByMonth> Days { get; set; }
    }
}