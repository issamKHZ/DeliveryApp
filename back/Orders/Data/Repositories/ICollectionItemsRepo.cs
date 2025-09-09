using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Orders.Models;

namespace Orders.Data.Repositories
{
    public interface ICollectionItemsRepo
    {
        public Task<Collection_Item> GetItemByCode(string code);
        public Task<ICollection<Collection_Item>?> GetItemsByType(string type);
    }
}