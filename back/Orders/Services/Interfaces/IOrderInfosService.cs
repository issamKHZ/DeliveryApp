using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Orders.Dtos.CollectionItems;

namespace Orders.Services.Interfaces
{
    public interface IOrderInfosService
    {
        public Task<ICollection<Collection_Items_Dto>> GetItems(string v);
    }
}