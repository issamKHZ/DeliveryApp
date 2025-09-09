using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Orders.Dtos.CollectionItems;
using Orders.Dtos.Sites;
using Orders.Services;

namespace Orders.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SitesController : ControllerBase
    {
        private readonly ISitesService _sitesService;

        public SitesController(ISitesService sitesService)
        {
            _sitesService = sitesService;
        }

        [HttpGet("sites")]
        [Authorize]
        [ProducesResponseType(typeof(ICollection<SitesResultDto>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetSites([FromQuery][Required] string entrepriseID)
        {

            var dto = await _sitesService.GetSites(entrepriseID);
            // if (dto == null)
            // {
            //     return NotFound("Sites Not Found");
            // }

            return Ok(dto);
        }

        [HttpGet("types")]
        [Authorize]
        [ProducesResponseType(typeof(ICollection<Collection_Items_Dto>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetTypes()
        {

            var dto = await _sitesService.GetItems("SitesTypes");

            if (dto == null)
            {
                return NotFound("Types Not Found");
            }

            return Ok(dto);
        }

        [HttpGet("disponibility")]
        [Authorize]
        [ProducesResponseType(typeof(ICollection<Collection_Items_Dto>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetDisponibilities()
        {

            var dto = await _sitesService.GetItems("Disponibility");

            if (dto == null)
            {
                return NotFound("Dispos Not Found");
            }

            return Ok(dto);
        }

        [HttpGet("cities")]
        [Authorize]
        [ProducesResponseType(typeof(ICollection<Cities_Dto>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetCities()
        {

            var dto = await _sitesService.GetCities();

            if (dto == null)
            {
                return NotFound("Cities Not Found");
            }

            return Ok(dto);
        }

        [HttpPost]
        [Authorize]
        [Route("add")]
        [ProducesResponseType(typeof(SitesResultDto), 200)]
        [ProducesResponseType(401)]
        public virtual async Task<IActionResult> AddNewSite([FromBody][Required] AddSiteDto siteDto)
        {
            var result = await _sitesService.AddNewSite(siteDto);
            return Ok(result);
        }

        [HttpPost]
        [Authorize]
        [Route("edit")]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(401)]
        public virtual async Task<IActionResult> EditSites([FromBody][Required] ICollection<AddSiteDto> sitesDto)
        {
            await _sitesService.EditSites(sitesDto);
            return Ok(true);
        }
        
        [HttpDelete]
        [Authorize]
        [Route("sites")]
        [ProducesResponseType(typeof(ICollection<int>), 200)]
        [ProducesResponseType(401)]
        public virtual async Task<IActionResult> DeleteSiege([FromBody] ICollection<int> ids)
        {                       
            var result = await _sitesService.DeleteSieges(ids);
            return Ok(result);
        }

    }
}