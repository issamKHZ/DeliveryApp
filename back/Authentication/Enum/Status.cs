using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Threading.Tasks;

namespace Authentication.Enum
{
    public enum Status
    {
        [Description("RESERVED")]
        RESERVED,
        [Description("DISPONIBLE")]
        DISPONIBLE,
        [Description("EN_LIVRAISON")]
        EN_LIVRAISON,
        [Description("BLOQUE")]
        BLOQUE,
        [Description("INACTIF")]
        INACTIF,
        [Description("SUSPENDU")]
        SUSPENDU,
        [Description("ACTIF")]
        ACTIF,
        [Description("EN_ATTENTE_VALIDATION")]
        EN_ATTENTE_VALIDATION,
    }
}