using System;
using System.Collections.Generic;

namespace Authentication.Models;

public partial class User
{
    public int Id { get; set; }

    public string AccountId { get; set; } = null!;

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public int StatusId { get; set; }

    public int RoleId { get; set; }

    public bool Validated { get; set; }

    public virtual Entreprise? Entreprise { get; set; }

    public virtual Livreur? Livreur { get; set; }

    public virtual Role Role { get; set; } = null!;

    public virtual UserStatus Status { get; set; } = null!;

    public virtual UserTokensValidation? UserTokensValidation { get; set; }
}
