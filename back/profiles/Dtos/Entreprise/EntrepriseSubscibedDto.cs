using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace profiles.Dtos.Entreprise
{
    public class EntrepriseSubscibedDto
    {
        public required string AccountId { get; set; }
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public required UserStatusDto StatusDto { get; set; }
        public DateTime CreationDate { get; set; }
        public string? Address { get; set; }
        public string? PostalCode { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? Event { get; set; }
    }
}