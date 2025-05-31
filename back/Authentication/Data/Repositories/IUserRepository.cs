using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authentication.Models;

namespace Authentication.Data.Repositories
{
    public interface IUserRepository
    {
        public bool UserExistsPhone(string phone);
        public bool UserExistsMail(string mail);
        public Task<User?> GetUserByMail(string mail);
        public Task<User?> AddUserAsync(User user);
        public Task<bool> SaveChanges();        
    }
}