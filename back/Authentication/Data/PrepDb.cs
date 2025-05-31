using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authentication.Models;
using Microsoft.EntityFrameworkCore;

namespace Authentication.Data
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

            if (!context.Roles.Any())
            {
                Console.WriteLine("--> Seeding Roles...");
                context.Roles.AddRange(
                    new Role { Code = "ADMIN", Description = "all access rights" },
                    new Role { Code = "ENTREPRISE", Description = "entreprise access rights" },
                    new Role { Code = "LIVREUR", Description = "livreur access rights" }
                );
            }

            if (!context.UserStatuses.Any())
            {
                Console.WriteLine("--> Seeding User Statuses...");
                context.UserStatuses.AddRange(
                    new UserStatus { Code = "EN_ATTENTE_VALIDATION", Label = "Att validation" },
                    new UserStatus { Code = "ACTIF", Label = "Actif" },
                    new UserStatus { Code = "SUSPENDU", Label = "Suspendu" },
                    new UserStatus { Code = "INACTIF", Label = "Inactif" },
                    new UserStatus { Code = "BLOQUE", Label = "Bloqué" },
                    new UserStatus { Code = "EN_LIVRAISON", Label = "En livraison" },
                    new UserStatus { Code = "DISPONIBLE", Label = "Disponible" },
                    new UserStatus { Code = "RESERVED", Label = "Réservé" }
                );
            }

            context.SaveChanges();
        }
    }
}