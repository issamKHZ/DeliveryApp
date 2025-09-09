using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Orders.Dtos.Schedule;
using Orders.Models;

namespace Orders.Data.Repositories
{
    public class ScheduleRepo : IScheduleRepo
    {

        private readonly AppDbContext _context;

        public ScheduleRepo(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Collection<Livreur_Schedule>> GetScheduleByPeriod(ScheduleTime period)
        {
            if (period == null)
            {
                return new Collection<Livreur_Schedule>();
            }

            if (string.IsNullOrEmpty(period.LivreurID))
            {
                throw new HttpRequestException("LivID", null, HttpStatusCode.BadRequest);
            }

            var list = await _context.Livreur_Schedules
                                     .Include(s => s.Livreur_Tasks)
                                     .Where(s => s.Month == period.Month
                                              && s.Year == period.Year
                                              && s.LivreurID == period.LivreurID)
                                     .ToListAsync();

            return new Collection<Livreur_Schedule>(list);
        }

        public async Task<Livreur_Schedule?> GetScheduleByPeriodAndUser(int day, int month, int year, string id)
        {
            return await _context.Livreur_Schedules
                        .Include(s => s.Livreur_Tasks)
                        .FirstOrDefaultAsync(s =>
                            s.Day == day &&
                            s.Month == month &&
                            s.Year == year &&
                            s.LivreurID == id);
        }

        public async Task<Livreur_Schedule?> AddScheduleAsync(Livreur_Schedule schedule)
        {
            if (schedule != null)
            {
                await _context.Livreur_Schedules.AddAsync(schedule);                
            }
            return schedule;
        }

        public void Update(Livreur_Schedule schedule)
        {
            _context.Livreur_Schedules.Update(schedule);
        }

        public async Task<bool> SaveChanges()
        {
            return await _context.SaveChangesAsync() >= 0;
        }


    }
}