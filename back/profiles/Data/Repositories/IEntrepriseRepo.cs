using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using profiles.Models;

namespace profiles.Data.Repositories
{
    public interface IEntrepriseRepo
    {
        public bool IsExistByMail(string email);
        public Task<Entreprise?> getEntrepriseByMail(string email);
        public Task<Entreprise?> getEntrepriseById(string id);
        public Task<Entreprise?> AddEntrepriseAsync(Entreprise entreprise);
        public Task<bool> SaveChanges();
    }
}