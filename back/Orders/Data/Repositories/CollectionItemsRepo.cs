using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Orders.Models;

namespace Orders.Data.Repositories
{
    public class CollectionItemsRepo: ICollectionItemsRepo
    {
        private readonly AppDbContext _context;
        
        public CollectionItemsRepo(AppDbContext context)
        {
            _context = context;
        }
         public async Task<Collection_Item> GetItemByCode(string code)
        {
            if (string.IsNullOrEmpty(code))
            {
                throw new HttpRequestException("item", null, HttpStatusCode.NotFound);
            }
            return await _context.Collection_Items.FirstAsync(c => c.Code == code);
        }

        public async Task<ICollection<Collection_Item>?> GetItemsByType(string type)
        {
            if (string.IsNullOrEmpty(type))
            {
                return null;
            }
            var CItype = await _context.Collections_Types.FirstAsync(t => t.Code == type);
            return await _context.Collection_Items
                .Where(c => c.Collection_Id == CItype.Id)
                .ToListAsync();
        }
    }
}