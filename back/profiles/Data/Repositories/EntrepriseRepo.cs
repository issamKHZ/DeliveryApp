using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using profiles.Models;

namespace profiles.Data.Repositories
{
    public class EntrepriseRepo : IEntrepriseRepo
    {
        private readonly AppDbContext context;

        public EntrepriseRepo(AppDbContext _context)
        {
            context = _context;
        }
        public async Task<Entreprise?> AddEntrepriseAsync(Entreprise entreprise)
        {
            if (entreprise != null)
            {
                await context.Entreprises.AddAsync(entreprise);
                await context.SaveChangesAsync();
            }
            return entreprise;
        }

        public async Task<Entreprise?> getEntrepriseByMail(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return null;
            }
            return await context.Entreprises
            .Include(e => e.Responsable)
            .Include(e => e.Status)
            .Include(e => e.ImgNavigation)
            .Include(e => e.DomicilationNavigation)
            .Include(e => e.CollectionItems)
            .FirstOrDefaultAsync(e => e.Email == email);
        }

        public async Task<Entreprise?> getEntrepriseById(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return null;
            }
            return await context.Entreprises
            .Include(e => e.Responsable)
            .Include(e => e.Status)
            .Include(e => e.ImgNavigation)
            .Include(e => e.DomicilationNavigation)
            .Include(e => e.CollectionItems)
            .FirstOrDefaultAsync(e => e.ID == id);
        }

        public bool IsExistByMail(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return false;
            }
            return context.Entreprises.Any(e => e.Email == email);
        }

        public async Task<bool> SaveChanges()
        {
            return await context.SaveChangesAsync() >= 0;
        }
    }
}