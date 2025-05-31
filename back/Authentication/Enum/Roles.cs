using System.ComponentModel;

namespace Authentication.Enum
{    
    public enum Roles
    {
        [Description("Entreprise")]
        ENTREPRISE,
        [Description("Livreur")]
        LIVREUR,
        [Description("Admin")]
        ADMIN,
    }
}