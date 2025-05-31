using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authentication.Dtos.Entreprise;
using Authentication.Dtos.Livreur;
using Authentication.Dtos.User;

namespace Authentication.Dtos
{
    public class RegistrationDto
    {
        public required UserRegistrationDto User { get; set; }
        public EntrepriseRegistrationDto? Entreprise { get; set; }
        public LivreurRegistrationDto? Livreur { get; set; }
    }
}