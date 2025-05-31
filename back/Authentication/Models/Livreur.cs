using System;
using System.Collections.Generic;

namespace Authentication.Models;

public partial class Livreur
{
    public int Id { get; set; }

    public DateTime CreationDate { get; set; }

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? RIB { get; set; }

    public string? Address { get; set; }

    public string? PostalCode { get; set; }

    public string? City { get; set; }

    public string? Country { get; set; }

    public int Age { get; set; }

    public string VehicleType { get; set; } = null!;

    public string? Description { get; set; }

    public virtual User IdNavigation { get; set; } = null!;
}
