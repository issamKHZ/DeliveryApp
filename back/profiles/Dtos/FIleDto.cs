using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace profiles.Dtos
{
    public class FIleDto
    {        
        public required string Nom { get; set; }
        public required string TypeMime { get; set; }
        public required long Taille { get; set; }
        public required DateTime DateCreation { get; set; }
        public required byte[] Donnees { get; set; }
    }
}