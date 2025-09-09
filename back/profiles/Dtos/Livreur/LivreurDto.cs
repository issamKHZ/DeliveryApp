using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace profiles.Dtos.Livreur
{
    public class LivreurDto
    {
        public required string ID { get; set; }
        public required string Name { get; set; }
        public required string Lastname { get; set; }    
        public string? Email { get; set; }    
        public required string Phone { get; set; }
        public required int Age { get; set; }
        public string? Rib { get; set; }
        public DateTime CreationDate { get; set; }
        public string? Adresse { get; set; }
        public string? Postal { get; set; }
        public string? City { get; set; }
        public string? Country { get; set; }
        public UserStatusDto? Status { get; set; }
        public string? Matricule { get; set; }
        public string? TypeVehicle { get; set; }
        public string? Modele { get; set; }
        public ICollection<string>? Langues { get; set; }
        public ICollection<ScheduleDto>? Horaires { get; set; }
        public IFormFile? ProfilImg { get; set; }
        public FileContentResult? ProfilImgResult { get; set; }
        public IFormFile? VehicleImg { get; set; }
        public FileContentResult? VehicleImgResult { get; set; }
        public IFormFile? Permis { get; set; }
        public FileContentResult? PermisResult { get; set; }
        public IFormFile? Assurance { get; set; }
        public FileContentResult? AssuranceResult { get; set; }

    }
}