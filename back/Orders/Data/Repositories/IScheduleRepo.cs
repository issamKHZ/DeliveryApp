using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using Orders.Dtos.Schedule;
using Orders.Models;

namespace Orders.Data.Repositories
{
    public interface IScheduleRepo
    {
        public Task<Collection<Livreur_Schedule>> GetScheduleByPeriod(ScheduleTime period);

        public Task<Livreur_Schedule?> GetScheduleByPeriodAndUser(int day, int month, int year, string id);

        public Task<Livreur_Schedule?> AddScheduleAsync(Livreur_Schedule schedule);

        public void Update(Livreur_Schedule schedule);

        public Task<bool> SaveChanges();        
    }
}