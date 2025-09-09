using System;
using System.Collections.Generic;

namespace Authentication.Models;

public partial class UserStatus
{
    public int Id { get; set; }

    public string Code { get; set; } = null!;

    public string Label { get; set; } = null!;

    public string? Severity { get; set; }

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
