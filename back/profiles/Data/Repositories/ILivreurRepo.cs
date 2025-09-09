using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using profiles.Models;

namespace profiles.Data.Repositories
{
    public interface ILivreurRepo
    {
        public bool IsExistByMail(string email);
        public bool IsExistByID(string email);
        public Task<Livreur?> getLivreurByMail(string email);
        public Task<Livreur?> getLivreurByID(string id);
        public Task<Livreur?> AddLivreurAsync(Livreur livreur);
        public Task<Vehicle> GetVehicleWithIncludes(int? vehicleId);        
        public Task<bool> SaveChanges();
        public Task<Horaire?> GetHorairesWithIncludes(int? horaire);
    }
}