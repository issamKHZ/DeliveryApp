using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using Orders.Models;

namespace Orders.Data.Repositories
{
    public interface ISitesRepo
    {        
        public Task<ICollection<Entrep_Site>?> GetSitesByEntrepID(string id);
        public Task<bool> SaveChanges();
        public Task<Entrep_Site?> AddUserAsync(Entrep_Site site);
        public Task<Entrep_Site?> GetSiteById(int? id);
        public Task RemoveSiteById(int id);
    }
}