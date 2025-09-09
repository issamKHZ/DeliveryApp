using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using profiles.Dtos.Livreur;
using profiles.Models;

namespace profiles.Services
{
    public class TimeService : ITimeService
    {
        public List<ScheduleDto> ConvertHoraireToScheduleDto(Horaire horaire)
        {
            var scheduleList = new List<ScheduleDto>();

            // Dictionnaire pour mapper les colonnes aux jours
            var dayMapping = new Dictionary<string, string>
            {
                { "MONDAY", "monday" },
                { "TUESDAY", "tuesday" },
                { "WEDNESDAY", "wednesday" },
                { "THURSDAY", "thursday" },
                { "FRIDAY", "friday" },
                { "SATURDAY", "saturday" },
                { "SANDAY", "sunday" }
            };

            foreach (var mapping in dayMapping)
            {
                var columnValue = typeof(Horaire).GetProperty(mapping.Key)?.GetValue(horaire) as string;
                var scheduleDto = new ScheduleDto
                {
                    Day = mapping.Value,
                    Dispo = true
                };

                if (string.IsNullOrEmpty(columnValue) || columnValue.ToUpper() == "NULL")
                {
                    scheduleDto.StartHour = null;
                    scheduleDto.EndHour = null;
                }
                else if (columnValue.ToUpper() == "INDISPO")
                {
                    scheduleDto.StartHour = null;
                    scheduleDto.EndHour = null;
                    scheduleDto.Dispo = false;
                }
                else
                {
                    var timeParts = columnValue.Split('-');
                    if (timeParts.Length == 2)
                    {
                        try
                        {
                            var startTimeParts = timeParts[0].Split(':');
                            var endTimeParts = timeParts[1].Split(':');

                            if (startTimeParts.Length == 2 && endTimeParts.Length == 2)
                            {
                                var today = DateTime.Today;
                                scheduleDto.StartHour = new DateTime(today.Year, today.Month, today.Day,
                                    int.Parse(startTimeParts[0]), int.Parse(startTimeParts[1]), 0);
                                scheduleDto.EndHour = new DateTime(today.Year, today.Month, today.Day,
                                    int.Parse(endTimeParts[0]), int.Parse(endTimeParts[1]), 0);
                            }
                        }
                        catch
                        {
                            scheduleDto.StartHour = null;
                            scheduleDto.EndHour = null;
                        }
                    }
                }

                scheduleList.Add(scheduleDto);
            }

            return scheduleList;
        }

        public StartEndHours GetHoursInterval(Horaire horaire, string day)
        {
            var propertyValue = typeof(Horaire).GetProperty(day)?.GetValue(horaire) as string;
            Console.WriteLine( "-------------------->" + JsonSerializer.Serialize(propertyValue));
            if (propertyValue == null)
            {
                throw new HttpRequestException("NULL", null, HttpStatusCode.NotFound);
            }
            if (propertyValue.Trim().ToUpper() == "INDISPO")
            {
                throw new HttpRequestException("NULL", null, HttpStatusCode.NotFound);
            }            

            var parts = propertyValue.Trim().Split('-', StringSplitOptions.RemoveEmptyEntries);            

            var start = TimeSpan.Parse(parts[0]);
            var end = TimeSpan.Parse(parts[1]);

            return new StartEndHours
            {
                Start = start.Hours.ToString(),
                End = end.Hours.ToString()
            };            
        }

        public ICollection<string> GetIndispoDays(Horaire horaire)
        {
            var indispoDays = new List<string>();

            var dayProperties = new Dictionary<string, string>
            {
                { "MONDAY", "monday" },
                { "TUESDAY", "tuesday" },
                { "WEDNESDAY", "wednesday" },
                { "THURSDAY", "thursday" },
                { "FRIDAY", "friday" },
                { "SATURDAY", "saturday" },
                { "SANDAY", "sunday" }
            };

            foreach (var dayProp in dayProperties)
            {
                var propertyValue = typeof(Horaire).GetProperty(dayProp.Key)?.GetValue(horaire) as string;

                // Vérifier si le jour est indisponible (null, vide ou "INDISPO")
                if (!string.IsNullOrEmpty(propertyValue) && propertyValue.Trim().ToUpper() == "INDISPO")
                {
                    indispoDays.Add(dayProp.Value);
                }
            }

            return indispoDays;
        }

    }

}