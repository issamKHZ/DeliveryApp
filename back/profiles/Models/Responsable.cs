using System;
using System.Collections.Generic;

namespace profiles.Models;

public partial class Responsable
{
    public int ID { get; set; }

    public string Name { get; set; } = null!;

    public string Lastname { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string? Phone { get; set; }

    public virtual ICollection<Entreprise> Entreprises { get; set; } = new List<Entreprise>();
}
