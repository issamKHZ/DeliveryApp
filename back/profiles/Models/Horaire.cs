using System;
using System.Collections.Generic;

namespace profiles.Models;

public partial class Horaire
{
    public int ID { get; set; }

    public string? MONDAY { get; set; }

    public string? TUESDAY { get; set; }

    public string? WEDNESDAY { get; set; }

    public string? THURSDAY { get; set; }

    public string? FRIDAY { get; set; }

    public string? SATURDAY { get; set; }

    public string? SANDAY { get; set; }

    public virtual ICollection<Livreur> Livreurs { get; set; } = new List<Livreur>();
}
