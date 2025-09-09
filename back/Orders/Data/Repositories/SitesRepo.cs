using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Orders.Models;

namespace Orders.Data.Repositories
{
    public class SitesRepo : ISitesRepo
    {
        private readonly AppDbContext _context;
        public SitesRepo(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Entrep_Site?> AddUserAsync(Entrep_Site site)
        {        
            if (site != null)
            {
                await _context.Entrep_Sites.AddAsync(site);
                await _context.SaveChangesAsync();
            }
            return site;        
        }       

        public async Task<ICollection<Entrep_Site>?> GetSitesByEntrepID(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return null;
            }
            return await _context.Entrep_Sites
                .Include(s => s.Type)
                .Include(s => s.Disponibility)
                .Include(s => s.City)
                .Where(s => s.EntrepriseID == id)
                .ToListAsync();
        }

        public async Task<Entrep_Site?> GetSiteById(int? id)
        {
            return await _context.Entrep_Sites.FindAsync(id);
        }

        public async Task RemoveSiteById(int id)
        {
            Entrep_Site? site = await _context.Entrep_Sites.FindAsync(id);
            if (site != null)
            {
                _context.Remove(site);
            }
            else
            {
                throw new Exception();
            }     
        }

        public async Task<bool> SaveChanges()
        {
            return await _context.SaveChangesAsync() >= 0;
        }
    }
}