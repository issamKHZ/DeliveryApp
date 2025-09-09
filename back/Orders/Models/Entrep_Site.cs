using System;
using System.Collections.Generic;

namespace Orders.Models;

public partial class Entrep_Site
{
    public int ID { get; set; }

    public int TypeID { get; set; }

    public int DisponibilityID { get; set; }

    public string Adresse { get; set; } = null!;

    public int CityID { get; set; }

    public string Email { get; set; } = null!;

    public string Phone { get; set; } = null!;

    public bool Destinateur { get; set; }

    public string EntrepriseID { get; set; } = null!;

    public virtual Cities_Country City { get; set; } = null!;

    public virtual Collection_Item Disponibility { get; set; } = null!;

    public virtual Collection_Item Type { get; set; } = null!;
}
