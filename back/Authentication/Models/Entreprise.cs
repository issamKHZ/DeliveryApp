using System;
using System.Collections.Generic;

namespace Authentication.Models;

public partial class Entreprise
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public string? SiretNumber { get; set; }

    public string? RIB { get; set; }

    public string? ResponsibleName { get; set; }

    public string Address { get; set; } = null!;

    public string PostalCode { get; set; } = null!;

    public string City { get; set; } = null!;

    public string Country { get; set; } = null!;

    public string? Description { get; set; }

    public string? ActivitySector { get; set; }

    public virtual User IdNavigation { get; set; } = null!;
}
