using System;
using System.Collections.Generic;

namespace profiles.Models;

public partial class Vehicle
{
    public int ID { get; set; }

    public string Matricule { get; set; } = null!;

    public int Type { get; set; }

    public string? Model { get; set; }

    public int? Img { get; set; }

    public int? Permis { get; set; }

    public int? Assurance { get; set; }

    public virtual DB_File? AssuranceNavigation { get; set; }

    public virtual DB_File? ImgNavigation { get; set; }

    public virtual ICollection<Livreur> Livreurs { get; set; } = new List<Livreur>();

    public virtual DB_File? PermisNavigation { get; set; }

    public virtual Collection_Item TypeNavigation { get; set; } = null!;
}
