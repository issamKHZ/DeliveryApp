using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Orders.Data.Repositories;
using Orders.Dtos.Schedule;
using Orders.Models;

namespace Orders.Services
{
    public class DisponibilityService : IDisponibilityService
    {
        private readonly IScheduleRepo _scheduleRepo;
        private readonly IMapper _mapper;

        public DisponibilityService(IScheduleRepo scheduleRepo,
                                    IMapper mapper)
        {
            _scheduleRepo = scheduleRepo;
            _mapper = mapper;
        }

        public async Task<bool> AddSchedules(string livreurId, ICollection<ScheduleByMonth> schedules)
        {
            try
            {
                foreach (var dto in schedules)
                {
                    var existing = await _scheduleRepo.GetScheduleByPeriodAndUser(dto.Day, dto.Month, dto.Year, livreurId);

                    if (existing != null)
                    {
                        existing.Disponibility = dto.Disponibility;

                        existing.Livreur_Tasks.Clear();
                        foreach (var taskDto in dto.Livreur_Tasks)
                        {
                            existing.Livreur_Tasks.Add(new Livreur_Task
                            {
                                Title = taskDto.Title,
                                StartHour = taskDto.StartHour.Hour,
                                EndHour = taskDto.EndHour.Hour,
                                Description = taskDto.Description,
                            });
                        }

                        _scheduleRepo.Update(existing);
                    }
                    else
                    {
                        var newSchedule = _mapper.Map<ScheduleByMonth, Livreur_Schedule>(dto);
                        newSchedule.LivreurID = livreurId;                                                

                        await _scheduleRepo.AddScheduleAsync(newSchedule);
                    }
                }

                await _scheduleRepo.SaveChanges();
                return true;
            }
            catch (Exception ex)
            {

                throw new HttpRequestException(ex.Message, null, HttpStatusCode.InternalServerError);
            }
        }


        public async Task<ICollection<ScheduleByMonth>> GetSchedule(ScheduleTime period)
        {
            ICollection<Livreur_Schedule> schedule = await _scheduleRepo.GetScheduleByPeriod(period);

            if (schedule.Count == 0)
            {
                return [];
            }

            return _mapper.Map<ICollection<Livreur_Schedule>, ICollection<ScheduleByMonth>>(schedule);
        }
    }
}