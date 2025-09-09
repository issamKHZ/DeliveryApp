using System;
using System.Collections.Generic;

namespace profiles.Models;

public partial class UserStatus
{
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string Label { get; set; } = null!;

    public string? Severity { get; set; }

    public virtual ICollection<Entreprise> Entreprises { get; set; } = new List<Entreprise>();

    public virtual ICollection<Livreur> Livreurs { get; set; } = new List<Livreur>();
}
