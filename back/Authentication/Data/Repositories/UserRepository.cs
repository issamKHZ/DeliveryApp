using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authentication.Models;
using Microsoft.EntityFrameworkCore;

namespace Authentication.Data.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public bool UserExistsMail(string mail)
        {
            if (string.IsNullOrEmpty(mail))
            {
                return false;
            }
            return _context.Users.Any(u => u.Email == mail);
        }

        public bool UserExistsPhone(string phone)
        {
            if (string.IsNullOrEmpty(phone))
            {
                return false;
            }
            return _context.Users.Any(u => u.PhoneNumber == phone);
        }

        public async Task<User?> GetUserByMail(string mail)
        {
            if (string.IsNullOrEmpty(mail))
            {
                return null;
            }
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == mail);
        }

        public async Task<User?> GetUserByID(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return null;
            }
            return await _context.Users.FirstOrDefaultAsync(u => u.AccountId == id);
        }

        public async Task<User?> AddUserAsync(User user)
        {
            if (user != null)
            {
                await _context.Users.AddAsync(user);
                await _context.SaveChangesAsync();
            }
            return user;
        }

        public async Task<bool> SaveChanges()
        {
            return await _context.SaveChangesAsync() >= 0;
        }
    }
}