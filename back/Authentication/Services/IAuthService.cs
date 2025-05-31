using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authentication.Dtos;
using Authentication.Dtos.Entreprise;
using Authentication.Dtos.User;
using Authentication.Models;

namespace Authentication.Services
{
    public interface IAuthService
    {
        public Task<LoginResultDto> Login(LoginDto credentials);
        public Task<string> Register(RegistrationDto userDto);
        public Task<string> RegisterEntreprise(RegistrationDto userDto, User user, string token);
        public Task<string> RegisterLivreur(RegistrationDto userDto, User user, string token);
        public Task sendValidationEmail(string email);
        public Task<UserAfterValidDto> ValidateEmailUser(string token);
        public Task<bool> SendRecover(string mail);
        public Task<bool> resetPassword(ResetPwdDto data);
    }
}