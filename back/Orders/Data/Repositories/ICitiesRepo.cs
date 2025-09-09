using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Orders.Models;

namespace Orders.Data.Repositories
{
    public interface ICitiesRepo
    {
        public Task<Cities_Country> GetCityByCity(string city);
        public Task<ICollection<Cities_Country>> GetAllCities();
    }
}