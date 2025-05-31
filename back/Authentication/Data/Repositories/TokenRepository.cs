using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authentication.Models;
using Microsoft.EntityFrameworkCore;

namespace Authentication.Data.Repositories
{
    public class TokenRepository : ITokenRepository
    {
        private readonly AppDbContext _context;

        public TokenRepository(AppDbContext context)
        {
            _context = context;
        }

        public void DeleteToken(string token)
        {
            if (!string.IsNullOrEmpty(token))
            {
                var tokenEntity = _context.UserTokensValidations.FirstOrDefault(t => t.EmailValidationToken == token);
                if (tokenEntity != null)
                {
                    _context.UserTokensValidations.Remove(tokenEntity);                    
                }
            }
        }

        public bool ExistsToken(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return false;
            }
            return _context.UserTokensValidations.Any(t => t.EmailValidationToken == token);
        }

        public bool ExistsTokenPwd(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return false;
            }
            return _context.UserTokensValidations.Any(t => t.PasswordResetToken == token);
        }

        public UserTokensValidation? GetToken(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return null;
            }
            return _context.UserTokensValidations.FirstOrDefault(t => t.EmailValidationToken == token);
        }

        public UserTokensValidation? GetTokenPwd(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return null;
            }
            return _context.UserTokensValidations.FirstOrDefault(t => t.PasswordResetToken == token);
        }

        public async Task<bool> SaveChanges()
        {
            return await _context.SaveChangesAsync() >= 0;
        }
    }
}