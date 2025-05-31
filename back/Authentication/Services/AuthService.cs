using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Authentication.Data;
using Authentication.Data.Repositories;
using Authentication.Dtos;
using Authentication.Dtos.Entreprise;
using Authentication.Dtos.Livreur;
using Authentication.Dtos.User;
using Authentication.Enum;
using Authentication.Models;
using Authentication.Utils;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace Authentication.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository userRepo;
        private readonly ITokenRepository tokenRepo;
        private readonly AppDbContext context;
        private readonly IMapper mapper;
        private readonly IEmailService emailService;
        private readonly IConfiguration _configuration;

        public AuthService(IUserRepository _userRepo,
                           AppDbContext _context,
                           IMapper _mapper,
                           IEmailService _emailService,
                           ITokenRepository _tokenRepo,
                           IConfiguration configuration)
        {
            userRepo = _userRepo;
            context = _context;
            mapper = _mapper;
            emailService = _emailService;
            tokenRepo = _tokenRepo;
            _configuration = configuration;
        }

        public async Task<LoginResultDto> Login(LoginDto credentials)
        {
            if (string.IsNullOrWhiteSpace(credentials.Email) || string.IsNullOrWhiteSpace(credentials.Password))
            {
                throw new HttpRequestException("credentials", null, HttpStatusCode.BadRequest);
            }

            var user = await context.Users
                .Include(u => u.Role)
                .Include(u => u.Entreprise)
                .Include(u => u.Livreur)
                .FirstOrDefaultAsync(u => u.Email == credentials.Email);

            if (user == null)
            {
                throw new HttpRequestException("credentials", null, HttpStatusCode.NotFound);
            }

            if (!user.Validated)
            {
                /* si le token non expiré */
                // envoyer la reponse qui me permet ne naviguer vers mon la page de validation de mail

                /* si token expiré */
                // notifier l'admin et dire au utilisateur qu'il faut attends le mail des admin
                throw new HttpRequestException("user not validated", null, HttpStatusCode.NotFound);
            }

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(credentials.Password, user.PasswordHash);

            if (!isPasswordValid)
            {
                throw new HttpRequestException("credentials", null, HttpStatusCode.Unauthorized);
            }

            // Génération du token JWT
            string token = tokenGenerator.GenerateJwtToken(user.Email, user.Role.Code, _configuration);

            return new LoginResultDto
            {
                Token = token,
                Role = EnumHelper.GetRoleFromString(user.Role.Code)
            };
        }


        public async Task<string> Register(RegistrationDto userDto)
        {
            if (userRepo.UserExistsMail(userDto.User.Email))
            {
                throw new HttpRequestException("Email", null, HttpStatusCode.Conflict);
            }
            else if (userRepo.UserExistsPhone(userDto.User.PhoneNumber))
            {
                throw new HttpRequestException("PhoneNumber", null, HttpStatusCode.Conflict);
            }

            int roleId = (int)context.Roles.FirstOrDefault(r => r.Code == userDto.User.Role.ToString())?.Id!;
            int statusId = (int)context.UserStatuses.FirstOrDefault(r => r.Code == Status.EN_ATTENTE_VALIDATION.ToString())?.Id!;

            User user = mapper.Map<User>(userDto.User);
            user.AccountId = AccountIdGenerator.GenerateAccountId(userDto.User.Email, Roles.ENTREPRISE);
            user.StatusId = statusId;
            user.RoleId = roleId;
            user.Validated = false;
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(userDto.User.Password);

            //generate token
            UserTokensValidation userTokenEmail = new UserTokensValidation
            {
                EmailValidationToken = Guid.NewGuid().ToString(),
                EmailTokenExpiration = DateTime.UtcNow.AddHours(2),
                User = user
            };

            // context.UserTokensValidations.Add(userTokenEmail);

            user.UserTokensValidation = userTokenEmail;

            if (userDto.User.Role == Roles.ENTREPRISE)
            {
                return await RegisterEntreprise(userDto, user, userTokenEmail.EmailValidationToken);
            }
            else if (userDto.User.Role == Roles.LIVREUR)
            {
                return await RegisterLivreur(userDto, user, userTokenEmail.EmailValidationToken);
            }
            else
            {
                throw new HttpRequestException("Role Not Found", null, HttpStatusCode.NotFound);
            }
        }

        public async Task<string> RegisterEntreprise(RegistrationDto userDto, User user, string token)
        {

            if (userDto.Entreprise != null)
            {
                Entreprise entreprise = mapper.Map<Entreprise>(userDto.Entreprise);
                entreprise.IdNavigation = user;

                context.Entreprises.Add(entreprise);

            }

            context.SaveChanges();
            await composeMail(userDto.User.Email, token, false);
            return userDto.User.Email;
        }

        public async Task<string> RegisterLivreur(RegistrationDto userDto, User user, string token)
        {
            if (userDto.Livreur != null)
            {
                Livreur livreur = mapper.Map<Livreur>(userDto.Livreur);
                livreur.IdNavigation = user;

                context.Livreurs.Add(livreur);
            }

            context.SaveChanges();
            await composeMail(userDto.User.Email, token, false);
            return userDto.User.Email;
        }

        public async Task sendValidationEmail(string email)
        {
            if (!userRepo.UserExistsMail(email))
            {
                throw new HttpRequestException("user", null, HttpStatusCode.NotFound);
            }

            User user = context.Users.First(user => user.Email == email);
            UserTokensValidation? tokenInfos = context.UserTokensValidations.FirstOrDefault(t => t.UserId == user.Id);

            if (tokenInfos == null)
            {
                // notifier le support
                throw new HttpRequestException("tokenv", null, HttpStatusCode.NotFound);
            }
            else if (tokenInfos.EmailValidationToken == null)
            {
                //notifier support (admin)
                throw new HttpRequestException("tokenValue", null, HttpStatusCode.NotFound); 
            }
            else
            {
                await composeMail(email, tokenInfos.EmailValidationToken, false);
            }
        }

        private async Task composeMail(string email, string? token, bool isPwd)
        {
            var confirmationLink = "";
            var htmlContent = "";
            var subject = "";

            if (isPwd)
            {
                subject = "Réinitialiser votre mot de passe";
                confirmationLink = $"http://localhost:4200/auth/login?token={token}";
                htmlContent = File.ReadAllText("Templates/reset-pwd-template.html").Replace("{{confirmationLink}}", confirmationLink);
            }
            else
            {
                subject = "Validez votre compte";
                confirmationLink = $"http://localhost:4200/validation/mail?token={token}";
                htmlContent = File.ReadAllText("Templates/email-template.html").Replace("{{confirmationLink}}", confirmationLink);
            }


            await emailService.SendAsync(email, subject, htmlContent);
        }

        public async Task<UserAfterValidDto> ValidateEmailUser(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
                throw new HttpRequestException("token", null, HttpStatusCode.BadRequest);

            // Vérifie si le token existe
            if (!tokenRepo.ExistsToken(token))
            {
                return new UserAfterValidDto
                {
                    RedirectToLogin = true
                };
            }

            var tokenObject = tokenRepo.GetToken(token);
            if (tokenObject == null)
            {
                return new UserAfterValidDto
                {
                    RedirectToLogin = true
                };
            }

            var concernedUser = await context.Users
                .Include(u => u.Role)
                .FirstOrDefaultAsync(u => u.Id == tokenObject.UserId);

            if (concernedUser == null)
                throw new HttpRequestException("user", null, HttpStatusCode.NotFound);

            // Si l'utilisateur est déjà validé
            if (concernedUser.Validated)
            {
                tokenRepo.DeleteToken(token);
                return new UserAfterValidDto
                {
                    RedirectToLogin = true
                };
            }

            // Vérifie l'expiration du token
            if (tokenObject.EmailTokenExpiration < DateTime.UtcNow)
            {
                tokenRepo.DeleteToken(token); // Supprime même les tokens expirés

                return new UserAfterValidDto
                {
                    RedirectToLogin = true,
                    Message = "wait for support"
                };
            }

            // Valide le compte
            concernedUser.Validated = true;
            context.Users.Update(concernedUser);

            var loginToken = tokenGenerator.GenerateJwtToken(
                concernedUser.Email,
                concernedUser.Role.Code,
                _configuration
            );

            tokenRepo.DeleteToken(token);
            await context.SaveChangesAsync();

            return new UserAfterValidDto
            {
                RedirectToLogin = false,
                LoginToken = loginToken,
                Token = ""
            };
        }

        public async Task<bool> SendRecover(string mail)
        {
            if (!userRepo.UserExistsMail(mail))
            {
                throw new HttpRequestException("user", null, HttpStatusCode.NotFound);
            }

            User user = context.Users
                        .Include(u => u.UserTokensValidation)
                        .First(user => user.Email == mail);

            if (user.UserTokensValidation != null)
            {
                user.UserTokensValidation.PasswordResetToken = Guid.NewGuid().ToString();
            }
            else
            {
                UserTokensValidation userTokenEmail = new UserTokensValidation
                {
                    PasswordResetToken = Guid.NewGuid().ToString(),
                    User = user
                };

                user.UserTokensValidation = userTokenEmail;
            }
            
            context.SaveChanges();
            await composeMail(mail, user.UserTokensValidation.PasswordResetToken, true);
            return true;
        }

        public async Task<bool> resetPassword(ResetPwdDto data)
        {
            var token = data.ResetToken;
            var password = data.password;

            if (token == null || password == null)
            {
                throw new HttpRequestException("null input", null, HttpStatusCode.BadRequest);
            }

            if (!tokenRepo.ExistsTokenPwd(token))
            {
                // notifier l'admin    
                throw new HttpRequestException("token", null, HttpStatusCode.NotFound);
            }

            UserTokensValidation tokenInfos = tokenRepo.GetTokenPwd(token)!;

            // Modifier le password
            User? user = context.Users.FirstOrDefault(u => u.UserTokensValidation == tokenInfos) ?? throw new HttpRequestException("user", null, HttpStatusCode.NotFound);
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(password);

            await context.SaveChangesAsync();

            return true;
            
        }
    }
}