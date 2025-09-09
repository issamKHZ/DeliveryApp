using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Orders.Models;

namespace Orders.Data.Repositories
{
    public class CitiesRepo : ICitiesRepo
    {
        private readonly AppDbContext _context;

        public CitiesRepo(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ICollection<Cities_Country>> GetAllCities()
        {
            return await _context.Cities_Countries.AsNoTracking().ToListAsync();
        }

        public async Task<Cities_Country> GetCityByCity(string cityCode)
        {
            if (string.IsNullOrEmpty(cityCode))
            {
                throw new HttpRequestException("city", null, HttpStatusCode.NotFound);
            }
            try
            {
                Cities_Country? city = await _context.Cities_Countries.FirstAsync(c => c.City == cityCode);
                return city;
            }
            catch (Exception e)
            {
                throw new HttpRequestException(e.Message, null, HttpStatusCode.NotFound);
            }
                            
        }
    }
}