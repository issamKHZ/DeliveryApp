using System;
using System.Collections.Generic;

namespace Authentication.Models;

public partial class UserTokensValidation
{
    public int UserId { get; set; }

    public string? EmailValidationToken { get; set; }

    public string? PasswordResetToken { get; set; }

    public DateTime? EmailTokenExpiration { get; set; }

    public DateTime? PasswordTokenExpiration { get; set; }

    public virtual User User { get; set; } = null!;
}
