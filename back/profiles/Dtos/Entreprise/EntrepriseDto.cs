using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace profiles.Dtos.Entreprise
{
    public class EntrepriseDto
    {
        public required string ID { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
        public string? Web { get; set; }
        public DateTime? CreationDate { get; set; }
        public string? Adresse { get; set; }
        public string? Postal { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public string? Siret { get; set; }
        public string? LivraisonNotice { get; set; }
        public UserStatusDto? Status { get; set; }
        public ResponsableDto? Responsable { get; set; }
        public IFormFile? Image { get; set; }
        public FileContentResult? ImageResult { get; set; }
        public IFormFile? DomicileFile { get; set; }
        public FileContentResult? DomicileResult { get; set; }
        public ICollection<string>? ActivitySector { get; set; } 
    }
}