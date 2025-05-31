using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Authentication.Dtos;
using Authentication.Dtos.Entreprise;
using Authentication.Dtos.User;
using Authentication.Services;
using Microsoft.AspNetCore.Mvc;

namespace Authentication.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService authService;

        public AuthenticationController(
            IAuthService _authService
        )
        {
            authService = _authService;
        }

        [HttpPost]
        [Route("register")]
        [ProducesResponseType(typeof(string), 200)]
        public virtual async Task<IActionResult> Register([FromBody][Required] RegistrationDto userDto)
        {
            var email = await authService.Register(userDto);
            return Ok(new { email });
        }

        [HttpGet]
        [Route("email-validation")]
        [ProducesResponseType(typeof(UserAfterValidDto), 200)]
        public virtual async Task<IActionResult> ValidateEmail([FromQuery][Required] string validationToken)
        {
            var dto = await authService.ValidateEmailUser(validationToken);
            return StatusCode(200, dto);
        }

        [HttpPost]
        [Route("email-validation")]
        [ProducesResponseType(typeof(bool), 200)]
        public virtual async Task<IActionResult> SendValidationEmail([FromQuery][Required] string email)
        {
            await authService.sendValidationEmail(email);
            return StatusCode(200, true);
        }

        [HttpPost]
        [Route("login")]
        [ProducesResponseType(typeof(LoginResultDto), 200)]
        public virtual async Task<IActionResult> Login([FromBody] LoginDto credentials)
        {
            var dto = await authService.Login(credentials);
            return StatusCode(200, dto);
        }

        [HttpPost]
        [Route("send-recover")]
        [ProducesResponseType(typeof(bool), 200)]
        public virtual async Task<IActionResult> SendRecover([FromQuery][Required] string email)
        {
            var dto = await authService.SendRecover(email);
            return StatusCode(200, dto);
        }  

        [HttpPost]
        [Route("reset-password")]
        [ProducesResponseType(typeof(bool), 200)]
        public virtual async Task<IActionResult> resetPassword([FromBody][Required] ResetPwdDto data)
        {
            var dto = await authService.resetPassword(data);
            return StatusCode(200, dto);
        }        
    }
}