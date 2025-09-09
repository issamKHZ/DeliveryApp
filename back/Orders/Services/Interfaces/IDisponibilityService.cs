using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Orders.Dtos.Schedule;

namespace Orders.Services
{
    public interface IDisponibilityService
    {
        public Task<bool> AddSchedules(string livreurID, ICollection<ScheduleByMonth> schedule);
        public Task<ICollection<ScheduleByMonth>> GetSchedule(ScheduleTime period);
    }
}