using System;
using System.Collections.Generic;

namespace profiles.Models;

public partial class DB_File
{
    public int ID { get; set; }

    public string Nom { get; set; } = null!;

    public string? TypeMime { get; set; }

    public byte[]? Donnees { get; set; }

    public DateTime? DateCreation { get; set; }

    public long? Taille { get; set; }

    public virtual ICollection<Entreprise> EntrepriseDomicilationNavigations { get; set; } = new List<Entreprise>();

    public virtual ICollection<Entreprise> EntrepriseImgNavigations { get; set; } = new List<Entreprise>();

    public virtual ICollection<Livreur> Livreurs { get; set; } = new List<Livreur>();

    public virtual ICollection<Vehicle> VehicleAssuranceNavigations { get; set; } = new List<Vehicle>();

    public virtual ICollection<Vehicle> VehicleImgNavigations { get; set; } = new List<Vehicle>();

    public virtual ICollection<Vehicle> VehiclePermisNavigations { get; set; } = new List<Vehicle>();
}
