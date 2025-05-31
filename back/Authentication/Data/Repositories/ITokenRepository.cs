using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authentication.Models;

namespace Authentication.Data.Repositories
{
    public interface ITokenRepository
    {
        public bool ExistsToken(string token);
        public UserTokensValidation? GetToken(string token);
        public void DeleteToken(string token);
        public Task<bool> SaveChanges();
        public UserTokensValidation? GetTokenPwd(string token);
        public bool ExistsTokenPwd(string token);             
    }
}