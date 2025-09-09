using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using profiles.Models;

namespace profiles.Data
{
    public class PrepDb
    {
        public static void PrepPopulation(IApplicationBuilder app)
        {
            using (var serviceScope = app.ApplicationServices.CreateScope())
            {
                var context = serviceScope.ServiceProvider.GetRequiredService<AppDbContext>();
                SeedData(context);
            }
        }

        private static void SeedData(AppDbContext context)
        {
            if (!context.UserStatuses.Any())
            {
                Console.WriteLine("--> Seeding User Statuses...");
                context.UserStatuses.AddRange(
                    new UserStatus { Code = "EN_ATTENTE_VALIDATION", Label = "Att validation", Severity = "WARN" },
                    new UserStatus { Code = "ACTIF", Label = "Actif", Severity = "SUCCESS" },
                    new UserStatus { Code = "SUSPENDU", Label = "Suspendu", Severity = "WARN"},
                    new UserStatus { Code = "INACTIF", Label = "Inactif", Severity = "DANGER" },
                    new UserStatus { Code = "BLOQUE", Label = "Bloqué", Severity = "DANGER" },
                    new UserStatus { Code = "EN_LIVRAISON", Label = "En livraison", Severity = "INFO" },
                    new UserStatus { Code = "DISPONIBLE", Label = "Disponible", Severity = "SUCCESS" },
                    new UserStatus { Code = "RESERVED", Label = "Réservé", Severity = "WARN" }
                );
            }

            context.SaveChanges();

            if (!context.Collections_Types.Any())
            {
                Console.WriteLine("--> Seeding Collection types...");
                context.Collections_Types.AddRange(
                    new Collections_Type { Code = "VehicleTypes", Label = "Vehicle Types" },
                    new Collections_Type { Code = "Languages", Label = "Languages" },
                    new Collections_Type { Code = "Secteurs", Label = "Secteurs" }
                );
            }

            context.SaveChanges();            

            if (!context.Collection_Items.Any())
            {
                Console.WriteLine("--> Seeding Collection Items...");
                // Add vehicles types
                var vehicleTypeId = context.Collections_Types.First(c => c.Code == "VehicleTypes").Id;
                context.Collection_Items.AddRange(
                    new Collection_Item { Code = "bike", Label = "Vélo", Collection_Id = vehicleTypeId },
                    new Collection_Item { Code = "moto", Label = "Motocycle", Collection_Id = vehicleTypeId },
                    new Collection_Item { Code = "car", Label = "Voiture", Collection_Id = vehicleTypeId },
                    new Collection_Item { Code = "camionnette", Label = "Camionnette", Collection_Id = vehicleTypeId },
                    new Collection_Item { Code = "camion", Label = "Camion", Collection_Id = vehicleTypeId }
                );

                // Add Languages
                var languageId = context.Collections_Types.First(c => c.Code == "Languages").Id;
                context.Collection_Items.AddRange(
                    new Collection_Item { Code = "AR", Label = "Arabe", Collection_Id = languageId },
                    new Collection_Item { Code = "FR", Label = "Français", Collection_Id = languageId },
                    new Collection_Item { Code = "EN", Label = "Anglais", Collection_Id = languageId }
                );

                // Add Sectors
                var sectorId = context.Collections_Types.First(c => c.Code == "Secteurs").Id;
                context.Collection_Items.AddRange(
                    new Collection_Item { Code = "logistique", Label = "Transport et logistique", Collection_Id = sectorId },
                    new Collection_Item { Code = "ecommerce", Label = "E-commerce", Collection_Id = sectorId },
                    new Collection_Item { Code = "restauration", Label = "Restauration", Collection_Id = sectorId },
                    new Collection_Item { Code = "sante", Label = "Santé / Pharmaceutique", Collection_Id = sectorId },
                    new Collection_Item { Code = "agroalimentaire", Label = "Agroalimentaire", Collection_Id = sectorId },
                    new Collection_Item { Code = "distribution", Label = "Distribution de colis", Collection_Id = sectorId },
                    new Collection_Item { Code = "commerce", Label = "Commerce de détail", Collection_Id = sectorId },
                    new Collection_Item { Code = "fleurs", Label = "Fleurs et cadeaux", Collection_Id = sectorId },
                    new Collection_Item { Code = "meubles", Label = "Meubles et électroménagers", Collection_Id = sectorId },
                    new Collection_Item { Code = "materiaux", Label = "Matériaux de construction", Collection_Id = sectorId },
                    new Collection_Item { Code = "electronique", Label = "Produits électroniques", Collection_Id = sectorId },
                    new Collection_Item { Code = "coursiers", Label = "Services de coursiers express", Collection_Id = sectorId },
                    new Collection_Item { Code = "carburant", Label = "Carburant / Gaz", Collection_Id = sectorId },
                    new Collection_Item { Code = "demenagement", Label = "Déménagement", Collection_Id = sectorId },
                    new Collection_Item { Code = "postaux", Label = "Services postaux", Collection_Id = sectorId },
                    new Collection_Item { Code = "textile", Label = "Textile / Habillement", Collection_Id = sectorId },
                    new Collection_Item { Code = "blanchisserie", Label = "Blanchisserie / Pressing", Collection_Id = sectorId },
                    new Collection_Item { Code = "agricole", Label = "Produits agricoles", Collection_Id = sectorId },
                    new Collection_Item { Code = "cosmetiques", Label = "Beauté / Cosmétiques", Collection_Id = sectorId },
                    new Collection_Item { Code = "marketplace", Label = "Marketplaces locales", Collection_Id = sectorId }
                );
            }

            context.SaveChanges();
        }
    }
}
