using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;

namespace profiles.Dtos.Entreprise
{
    public class EntrepriseAdministratifDto
    {
        public required string ID { get; set; }
        public string? ResponsableName { get; set; }
        public string? ResponsableEmail { get; set; }
        public string? ResponsablePhone { get; set; }
        public string? Adresse { get; set; }
        public string? PostalCode { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? SiretNumber { get; set; }
        public Collection<string>? ActivitySector { get; set; }
        public string? Description { get; set; }
        public string? JustificatifDomicil { get; set; }
        public IFormFile? DomicileFile { get; set; }
    }
}