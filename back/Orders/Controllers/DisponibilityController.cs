using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Orders.Dtos.Schedule;
using Orders.Services;

namespace Orders.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DisponibilityController : ControllerBase
    {
        private readonly IDisponibilityService _disponibilityService;

        public DisponibilityController(IDisponibilityService disponibilityService)
        {
            _disponibilityService = disponibilityService;
        }

        [HttpPost]
        [Authorize]
        [Route("schedule")]
        [ProducesResponseType(typeof(ICollection<ScheduleByMonth>), 200)]
        [ProducesResponseType(401)]
        public virtual async Task<IActionResult> GetSchedule([FromBody][Required] ScheduleTime period)
        {
            ICollection<ScheduleByMonth> schedule = await _disponibilityService.GetSchedule(period);
            return Ok(schedule);
        }

        [HttpPost]
        [Authorize]
        [Route("add")]
        [ProducesResponseType(typeof(ICollection<bool>), 200)]
        [ProducesResponseType(401)]
        public virtual async Task<IActionResult> AddSchedules([FromBody][Required] ScheduleDto schedule)
        {
            bool result = await _disponibilityService.AddSchedules(schedule.LivreurID, schedule.Days);
            return Ok(true);
        }
    }
}