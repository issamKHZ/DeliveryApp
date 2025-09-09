using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using profiles.Dtos.Livreur;
using profiles.Models;

namespace profiles.Services
{
    public interface ITimeService
    {
        public List<ScheduleDto> ConvertHoraireToScheduleDto(Horaire horaire);
        public StartEndHours GetHoursInterval(Horaire horaire, string day);
        public ICollection<string> GetIndispoDays(Horaire horaire);     
    }
}