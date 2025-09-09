using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using profiles.Dtos;
using profiles.Dtos.Livreur;
using profiles.Services;

namespace profiles.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class LivreurController : ControllerBase
    {
        private readonly ILivreurService livreurService;

        public LivreurController(ILivreurService _livreurService)
        {
            livreurService = _livreurService;
        }

        [HttpGet("get")]
        [Authorize]
        [ProducesResponseType(typeof(LivreurDto), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Get()
        {
            var email = User.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized("Email non trouvé dans le token");
            }

            var dto = await livreurService.GetLivreur(email);

            if (dto == null)
            {
                return NotFound("Livreur non trouvée");
            }

            return Ok(dto);
        }

        [HttpPost]
        [Authorize]
        [Route("edit")]
        [ProducesResponseType(typeof(LivreurDto), 200)]
        [ProducesResponseType(401)]
        public virtual async Task<IActionResult> EditProfile([FromForm][Required] LivreurDto livreurDto)
        {
            var email = User.FindFirst(ClaimTypes.Name)?.Value;
            Console.WriteLine("email");
            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized("Email non trouvé dans le token");
            }

            var result = await livreurService.Edit(livreurDto, email);
            return Ok(result);
        }

        [HttpGet("langues")]
        [Authorize]
        [ProducesResponseType(typeof(ICollection<Collection_Item_Dto>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetLangues()
        {
            var dto = await livreurService.GetLangues();

            if (dto == null)
            {
                return NotFound("Langues Not Found");
            }

            return Ok(dto);
        }

        [HttpGet("vehicles")]
        [Authorize]
        [ProducesResponseType(typeof(ICollection<Collection_Item_Dto>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetVehicles()
        {
            var dto = await livreurService.GetVehicles();

            if (dto == null)
            {
                return NotFound("Langues Not Found");
            }

            return Ok(dto);
        }

        [HttpGet("status")]
        [Authorize]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> CheckAccountStatus()
        {
            var email = User.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized("Email non trouvé dans le token");
            }

            var dto = await livreurService.CheckAccountStatus(email);

            return Ok(dto);
        }

        [HttpGet("dispo")]
        [Authorize]
        [ProducesResponseType(typeof(ICollection<string>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetSites([FromQuery][Required] string livreurID)
        {

            var dto = await livreurService.GetIdispoDays(livreurID);
            return Ok(dto);
        }

        [HttpGet("hours")]
        [Authorize]
        [ProducesResponseType(typeof(StartEndHours), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetHoursForDay([FromQuery][Required] string livreurID, [FromQuery][Required] string day)
        {
            var dto = await livreurService.GetHoursForDay(livreurID, day);
            return Ok(dto);
        }

        [HttpGet("name")]
        [Authorize]
        [ProducesResponseType(typeof(string), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetName([FromQuery][Required] string email)
        {
            var dto = await livreurService.GetName(email);
            return Ok(dto);
        }
        
    }
}