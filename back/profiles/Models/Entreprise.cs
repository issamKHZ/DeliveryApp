using System;
using System.Collections.Generic;

namespace profiles.Models;

public partial class Entreprise
{
    public string ID { get; set; } = null!;

    public string Name { get; set; } = null!;

    public DateTime CreationDate { get; set; }

    public string Email { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public string? Web { get; set; }

    public int? ResponsableID { get; set; }

    public string? Adresse { get; set; }

    public string? Postal { get; set; }

    public string? City { get; set; }

    public string? Country { get; set; }

    public string? Siret { get; set; }

    public string? LivraisonNotice { get; set; }

    public int? Img { get; set; }

    public int? Domicilation { get; set; }

    public int StatusID { get; set; }

    public virtual DB_File? DomicilationNavigation { get; set; }

    public virtual DB_File? ImgNavigation { get; set; }

    public virtual Responsable? Responsable { get; set; }

    public virtual UserStatus Status { get; set; } = null!;

    public virtual ICollection<Collection_Item> CollectionItems { get; set; } = new List<Collection_Item>();
}
