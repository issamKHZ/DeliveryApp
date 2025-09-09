using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace profiles.Dtos.Livreur
{
    public class LivreurSubscribedDto
    {
        public required string AccountId { get; set; }
        public required string Email { get; set; }
        public required string PhoneNumber { get; set; }
        public required UserStatusDto StatusDto { get; set; }
        public DateTime CreationDate { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Age { get; set; }
        public string? Address { get; set; }
        public string? PostalCode { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? VehicleType { get; set; }
    }
}