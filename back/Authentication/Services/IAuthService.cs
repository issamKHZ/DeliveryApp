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
        public Task<UserInvalidationDto> Register(RegistrationDto userDto);
        public Task<UserInvalidationDto> RegisterEntreprise(RegistrationDto userDto, User user, string token);
        public Task<UserInvalidationDto> RegisterLivreur(RegistrationDto userDto, User user, string token);
        public Task sendValidationEmail(string email);
        public Task<UserAfterValidDto> ValidateEmailUser(string token);
        public Task<bool> SendRecover(string mail);
        public Task<bool> resetPassword(ResetPwdDto data);
        public Task<UserInvalidationDto> GetPartielUser(string email);
        public Task<string> GetUserID(string email);
        public Task UpdateUserInfosFromProfile(UserInfosSubscibedDto dto);
    }
}