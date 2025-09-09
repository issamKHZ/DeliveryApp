using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using profiles.Models;

namespace profiles.Data.Repositories
{
    public class LivreurRepo : ILivreurRepo
    {

        private readonly AppDbContext context;

        public LivreurRepo(AppDbContext _context)
        {
            context = _context;
        }

        public async Task<Livreur?> AddLivreurAsync(Livreur livreur)
        {
            if (livreur != null)
            {
                await context.Livreurs.AddAsync(livreur);
                await context.SaveChangesAsync();
            }
            return livreur;
        }

        public async Task<Livreur?> getLivreurByID(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                return null;
            }

            return await context.Livreurs
                .Include(l => l.Status)
                .Include(l => l.CollectionItems)
                .Include(l => l.ImgNavigation)
                .Include(l => l.VehicleNavigation)
                    .ThenInclude(v => v.ImgNavigation)
                    .ThenInclude(v => v.VehicleAssuranceNavigations)
                    .ThenInclude(v => v.PermisNavigation)
                .Include(l => l.HoraireNavigation)
                .FirstOrDefaultAsync(l => l.ID == id);
        }

        public async Task<Livreur?> getLivreurByMail(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return null;
            }
            return await context.Livreurs
            .Include(l => l.Status)
            .Include(l => l.CollectionItems)
            .Include(l => l.ImgNavigation)
            .Include(l => l.VehicleNavigation)
                .ThenInclude(v => v.ImgNavigation)
                .ThenInclude(v => v.VehicleAssuranceNavigations)
                .ThenInclude(v => v.PermisNavigation)
            .FirstOrDefaultAsync(l => l.Email == email);
        }

        public bool IsExistByMail(string email)
        {
            throw new NotImplementedException();
        }

        public bool IsExistByID(string id)
        {
            return context.Livreurs.Any(l => l.ID == id);
        }

        public async Task<Vehicle> GetVehicleWithIncludes(int? vehicleId)
        {
            return await context.Vehicles
                .Include(v => v.TypeNavigation)
                .Include(v => v.ImgNavigation)
                .Include(v => v.AssuranceNavigation)
                .Include(v => v.PermisNavigation)
                .FirstAsync(v => v.ID == vehicleId);
        }

        public Task<bool> SaveChanges()
        {
            throw new NotImplementedException();
        }

        public async Task<Horaire?> GetHorairesWithIncludes(int? horaire)
        {
            if (horaire != null)
            {
                return await context.Horaires.FirstOrDefaultAsync(h => h.ID == horaire);
            }

            return null;
        }
    }
}