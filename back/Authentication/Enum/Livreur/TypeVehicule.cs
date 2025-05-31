using System.ComponentModel;

namespace Authentication.Enum.Entreprise
{
    public enum TypeVehicule
    {
        [Description("Velo")]
        VELO,
        [Description("Moto")]
        MOTO,
        [Description("Voiture")]
        VOITURE,
        [Description("Camionnette")]
        CAMIONNETTE,
        [Description("Camion")]
        CAMION
    }
}