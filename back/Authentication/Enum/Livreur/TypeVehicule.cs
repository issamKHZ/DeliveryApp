using System.ComponentModel;

namespace Authentication.Enum.Entreprise
{
    public enum TypeVehicule
    {
        [Description("Bike")]
        BIKE,
        [Description("Moto")]
        MOTO,
        [Description("Car")]
        CAR,
        [Description("Camionnette")]
        CAMIONNETTE,
        [Description("Camion")]
        CAMION
    }
}