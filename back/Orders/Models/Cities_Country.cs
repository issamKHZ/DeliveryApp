using System;
using System.Collections.Generic;

namespace Orders.Models;

public partial class Cities_Country
{
    public int ID { get; set; }

    public string City { get; set; } = null!;

    public string Country { get; set; } = null!;

    public virtual ICollection<Entrep_Site> Entrep_Sites { get; set; } = new List<Entrep_Site>();
}
