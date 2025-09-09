using System;
using System.Collections.Generic;

namespace Orders.Models;

public partial class Collection_Item
{
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string? Label { get; set; }

    public int Collection_Id { get; set; }

    public virtual Collections_Type Collection { get; set; } = null!;

    public virtual ICollection<Entrep_Site> Entrep_SiteDisponibilities { get; set; } = new List<Entrep_Site>();

    public virtual ICollection<Entrep_Site> Entrep_SiteTypes { get; set; } = new List<Entrep_Site>();
}
