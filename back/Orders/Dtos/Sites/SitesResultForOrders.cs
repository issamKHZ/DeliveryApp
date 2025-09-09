using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orders.Dtos.Sites
{
    public class SitesResultForOrders
    {
        public required int Id { get; set; }        
        public required bool IsDest { get; set; }
        public required string City { get; set; }
        public required string Country { get; set; }
        public required string TypeCode { get; set; }
    }
}