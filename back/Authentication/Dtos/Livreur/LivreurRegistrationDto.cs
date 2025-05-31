using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authentication.Enum.Entreprise;

namespace Authentication.Dtos.Livreur
{
    public class LivreurRegistrationDto
    {
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required int Age { get; set; }
        public required TypeVehicule VehicleType { get; set; }

    }
}