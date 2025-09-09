using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orders.Dtos.CollectionItems
{
    public class Cities_Dto
    {
        public required string Code { get; set; }
        public required string City { get; set; }
        public required string CountryCode { get; set; }
    }
}