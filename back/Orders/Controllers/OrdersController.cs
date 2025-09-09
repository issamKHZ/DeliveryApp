using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Orders.Dtos.CollectionItems;
using Orders.Dtos.Sites;
using Orders.Services;
using Orders.Services.Interfaces;

namespace Orders.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderInfosService _orderInfosService;
        private readonly ISitesService _sitesService;
        private readonly IMapper _mapper;

        public OrdersController(
            IOrderInfosService orderInfosService,
            ISitesService sitesService,
            IMapper mapper
            )
        {
            _orderInfosService = orderInfosService;
            _sitesService = sitesService;
            _mapper = mapper;
        }

        [HttpGet("deliv-status")]
        [Authorize]
        [ProducesResponseType(typeof(ICollection<Collection_Items_Dto>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetDeliveryStatus()
        {

            var dto = await _orderInfosService.GetItems("OfferStatus");

            if (dto == null)
            {
                return NotFound("Status Not Found");
            }

            return Ok(dto);
        }

        [HttpGet("deliv-modes")]
        [Authorize]
        [ProducesResponseType(typeof(ICollection<Collection_Items_Dto>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetDeliveryModes()
        {

            var dto = await _orderInfosService.GetItems("DeliveryMode");

            if (dto == null)
            {
                return NotFound("Modes Not Found");
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

        [HttpGet("sites")]
        [Authorize]
        [ProducesResponseType(typeof(ICollection<SitesResultForOrders>), 200)]
        [ProducesResponseType(401)]
        public async Task<IActionResult> GetSites([FromQuery][Required] string entrepriseID)
        {

            var dto = await _sitesService.GetSites(entrepriseID);

            return Ok(_mapper.Map<ICollection<SitesResultDto>, ICollection<SitesResultForOrders>>(dto));
        }

    }
}