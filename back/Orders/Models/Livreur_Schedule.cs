using System;
using System.Collections.Generic;

namespace Orders.Models;

public partial class Livreur_Schedule
{
    public int ID { get; set; }

    public int Day { get; set; }

    public int Month { get; set; }

    public int Year { get; set; }

    public bool? Disponibility { get; set; }

    public string LivreurID { get; set; } = null!;

    public virtual ICollection<Livreur_Task> Livreur_Tasks { get; set; } = new List<Livreur_Task>();
}
