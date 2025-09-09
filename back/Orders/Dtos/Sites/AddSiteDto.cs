using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Orders.Dtos.Sites
{
    public class AddSiteDto
    {
        public int? Id { get; set; }
        public required string Adresse { get; set; }
        public required string Email { get; set; }
        public required string Phone { get; set; }
        public required bool IsDest { get; set; }
        public required string City { get; set; }
        public required string DispoCode { get; set; }
        public required string TypeCode { get; set; }
        public required string EntrepriseID { get; set; }
    }
}