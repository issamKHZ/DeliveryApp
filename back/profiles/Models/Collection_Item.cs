using System;
using System.Collections.Generic;

namespace profiles.Models;

public partial class Collection_Item
{
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string? Label { get; set; }

    public int Collection_Id { get; set; }

    public virtual Collections_Type Collection { get; set; } = null!;

    public virtual ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();

    public virtual ICollection<Entreprise> Entreprises { get; set; } = new List<Entreprise>();

    public virtual ICollection<Livreur> Livreurs { get; set; } = new List<Livreur>();
}
