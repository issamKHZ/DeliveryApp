using System;
using System.Collections.Generic;

namespace Orders.Models;

public partial class Collections_Type
{
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string? Label { get; set; }

    public virtual ICollection<Collection_Item> Collection_Items { get; set; } = new List<Collection_Item>();
}
