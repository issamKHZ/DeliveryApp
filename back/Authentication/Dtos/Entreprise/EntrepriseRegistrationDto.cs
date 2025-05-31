using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Dtos.Entreprise
{
    public class EntrepriseRegistrationDto
    {                        
        public required string Address { get; set; }

        public required int PostalCode { get; set; }

        public required string City { get; set; }                          
    }
}