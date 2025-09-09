using System.ComponentModel;

namespace profiles.Enumerations
{
    public enum StatusEnum
    {
        [Description("ACTIF")]
        ACTIF,
        [Description("EN_LIVRAISON")]
        EN_LIVRAISON,
        [Description("DISPONIBLE")]
        DISPONIBLE,
        [Description("RESERVED")]
        RESERVED
    }
}