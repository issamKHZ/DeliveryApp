using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authentication.Enum;

namespace Authentication.Utils
{
    public class EnumHelper
    {
        public static Roles GetRoleFromString(string roleString)
        {
            roleString = roleString.ToLowerInvariant();

            if (roleString == "entreprise")
                return Roles.ENTREPRISE;
            else if (roleString == "livreur")
                return Roles.LIVREUR;
            else if (roleString == "admin")
                return Roles.ADMIN;
            else
                throw new ArgumentException("Rôle invalide.");
        }
    }
}