using System;
using System.Collections.Generic;

namespace Orders.Models;

public partial class Livreur_Task
{
    public int ID { get; set; }

    public string Title { get; set; } = null!;

    public int StartHour { get; set; }

    public int EndHour { get; set; }

    public string? Description { get; set; }

    public int DayID { get; set; }

    public virtual Livreur_Schedule Day { get; set; } = null!;
}
