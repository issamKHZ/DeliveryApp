using System;
using System.Collections.Generic;

namespace profiles.Models;

public partial class Livreur
{
    public string ID { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Lastname { get; set; } = null!;

    public DateTime CreationDate { get; set; }

    public string Email { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string? Adresse { get; set; }

    public string? Postal { get; set; }

    public string? City { get; set; }

    public int? Vehicle { get; set; }

    public int? Horaire { get; set; }

    public int StatusID { get; set; }

    public string? Country { get; set; }

    public int? Age { get; set; }

    public int? Img { get; set; }

    public string? RIB { get; set; }

    public virtual Horaire? HoraireNavigation { get; set; }

    public virtual DB_File? ImgNavigation { get; set; }

    public virtual UserStatus Status { get; set; } = null!;

    public virtual Vehicle? VehicleNavigation { get; set; }

    public virtual ICollection<Collection_Item> CollectionItems { get; set; } = new List<Collection_Item>();
}
