using Orders.Models;


namespace Orders.Data
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
            if (!context.Cities_Countries.Any())
            {
                Console.WriteLine("--> Seeding Cities_Country...");
                context.Cities_Countries.AddRange(
                    new Cities_Country { City = "Casablanca", Country = "Morocco" },
                    new Cities_Country { City = "Fès", Country = "Morocco" },
                    new Cities_Country { City = "Tanger", Country = "Morocco" },
                    new Cities_Country { City = "Salé", Country = "Morocco" },
                    new Cities_Country { City = "Marrakech", Country = "Morocco" },
                    new Cities_Country { City = "Meknès", Country = "Morocco" },
                    new Cities_Country { City = "Rabat", Country = "Morocco" },
                    new Cities_Country { City = "Oujda", Country = "Morocco" },
                    new Cities_Country { City = "Kénitra", Country = "Morocco" },
                    new Cities_Country { City = "Agadir", Country = "Morocco" },
                    new Cities_Country { City = "Tétouan", Country = "Morocco" },
                    new Cities_Country { City = "Safi", Country = "Morocco" },
                    new Cities_Country { City = "Mohammedia", Country = "Morocco" },
                    new Cities_Country { City = "Khouribga", Country = "Morocco" },
                    new Cities_Country { City = "El Jadida", Country = "Morocco" },
                    new Cities_Country { City = "Beni Mellal", Country = "Morocco" },
                    new Cities_Country { City = "Aït Melloul", Country = "Morocco" },
                    new Cities_Country { City = "Nador", Country = "Morocco" },
                    new Cities_Country { City = "Dar Bouazza", Country = "Morocco" },
                    new Cities_Country { City = "Taza", Country = "Morocco" }
                );                
            }

            context.SaveChanges();

            if (!context.Collections_Types.Any())
            {
                Console.WriteLine("--> Seeding Collection types...");
                context.Collections_Types.AddRange(
                    new Collections_Type { Code = "SitesTypes", Label = "Sites Types" },
                    new Collections_Type { Code = "Disponibility", Label = "Disponibility" },
                    new Collections_Type { Code = "OfferStatus", Label = "Offer Status"},
                    new Collections_Type { Code = "DeliveryMode", Label = "Delivery Mode"}
                );
            }

            context.SaveChanges();

            if (!context.Collection_Items.Any())
            {
                Console.WriteLine("--> Seeding Collection Items...");
                // Add sites types
                var siteTypeId = context.Collections_Types.First(c => c.Code == "SitesTypes").Id;
                context.Collection_Items.AddRange(
                    new Collection_Item { Code = "MAGASIN", Label = "Magasin de vente", Collection_Id = siteTypeId },
                    new Collection_Item { Code = "ENTREPOT", Label = "Entrepôt logistique", Collection_Id = siteTypeId },
                    new Collection_Item { Code = "ATELIER", Label = "Atelier de fabrication", Collection_Id = siteTypeId },
                    new Collection_Item { Code = "BOUTIQUE_EN_LIGNE", Label = "Boutique en ligne (e-commerce)", Collection_Id = siteTypeId },
                    new Collection_Item { Code = "RESTAURANT", Label = "Restaurant / Fast-food", Collection_Id = siteTypeId },
                    new Collection_Item { Code = "POINT_RETRAIT", Label = "Point de retrait / Click & Collect", Collection_Id = siteTypeId },
                    new Collection_Item { Code = "PLATEFORME_LOGISTIQUE", Label = "Plateforme logistique", Collection_Id = siteTypeId }
                );

                // Add sites dispo
                var dispoId = context.Collections_Types.First(c => c.Code == "Disponibility").Id;
                context.Collection_Items.AddRange(
                    new Collection_Item { Code = "ACT", Label = "En service", Collection_Id = dispoId },
                    new Collection_Item { Code = "MTN", Label = "En maintenance", Collection_Id = dispoId },
                    new Collection_Item { Code = "CLSDT", Label = "Fermé temp", Collection_Id = dispoId }
                );

                // Add offer status
                var offerId = context.Collections_Types.First(c => c.Code == "OfferStatus").Id;
                context.Collection_Items.AddRange(
                    new Collection_Item { Code = "NA", Label = "Non affecte", Collection_Id = offerId },
                    new Collection_Item { Code = "LEC", Label = "Livraison en cours", Collection_Id = offerId },
                    new Collection_Item { Code = "AS", Label = "Assigne", Collection_Id = offerId },
                    new Collection_Item { Code = "LV", Label = "Livre", Collection_Id = offerId },
                    new Collection_Item { Code = "ANN", Label = "Annule", Collection_Id = offerId },
                    new Collection_Item { Code = "RAT", Label = "En retard", Collection_Id = offerId }
                );

                // Add Liv Modes
                var livModeId = context.Collections_Types.First(c => c.Code == "DeliveryMode").Id;
                context.Collection_Items.AddRange(
                    new Collection_Item { Code = "SC", Label = "Same city", Collection_Id = livModeId },
                    new Collection_Item { Code = "BC", Label = "Between cities", Collection_Id = livModeId }                    
                );
            }

            context.SaveChanges();
        }
    }
}
