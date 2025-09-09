using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using profiles.Dtos;
using profiles.Dtos.Entreprise;
using profiles.Services;

namespace profiles.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class EntrepriseController : ControllerBase
    {
        private readonly IEntrepriseService entrepService;

        public EntrepriseController(IEntrepriseService _entrepService)
        {
            entrepService = _entrepService;
        }

        // [HttpPost]
        // [Route("edit")]
        // [ProducesResponseType(typeof(EntrepriseDto), 200)]
        // public virtual async Task<IActionResult> Edit([FromBody][Required] EntrepriseDto userDto)
        // {
        //     var email = await entrepService.Edit(userDto);
        //     return Ok(new { email });
        // }

        [HttpGet("get")]
        [Authorize]
        [ProducesResponseType(typeof(EntrepriseDto), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> Get()
        {
            var email = User.FindFirst(ClaimTypes.Name)?.Value;

            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized("Email non trouvé dans le token");
            }

            var dto = await entrepService.GetEntreprise(email);

            if (dto == null)
            {
                return NotFound("Entreprise non trouvée");
            }

            return Ok(dto);
        }

        [HttpPost]
        [Authorize]
        [Route("general")]
        [ProducesResponseType(typeof(EntrepriseDto), 200)]
        [ProducesResponseType(401)]
        public virtual async Task<IActionResult> EditGeneralInfos([FromForm][Required] EntrepriseDto entrepriseDto)
        {
            var email = User.FindFirst(ClaimTypes.Name)?.Value;
            Console.WriteLine("email");
            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized("Email non trouvé dans le token");
            }

            var result = await entrepService.EditGeneralInfos(entrepriseDto, email);
            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        [Route("administratif")]
        [ProducesResponseType(typeof(EntrepriseDto), 200)]
        [ProducesResponseType(401)]
        public virtual async Task<IActionResult> EditAdministratifInfos([FromForm][Required] EntrepriseAdministratifDto entrepriseDto)
        {
            var email = User.FindFirst(ClaimTypes.Name)?.Value;
            Console.WriteLine("email");
            if (string.IsNullOrEmpty(email))
            {
                return Unauthorized("Email non trouvé dans le token");
            }

            var result = await entrepService.EditAdministratifInfos(entrepriseDto, email);
            return Ok(result);
        }

        [HttpGet("sectors")]
        [Authorize]
        [ProducesResponseType(typeof(ICollection<Collection_Item_Dto>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetSectors()
        {

            var dto = await entrepService.GetSectors();

            if (dto == null)
            {
                return NotFound("Sectors Not Found");
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

            var dto = await entrepService.CheckAccountStatus(email);

            return Ok(dto);
        }
        
        [HttpGet("name")]
        [Authorize]
        [ProducesResponseType(typeof(string), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetName([FromQuery][Required] string email)
        {
            var dto = await entrepService.GetName(email);
            return Ok(dto);
        }

    }
}