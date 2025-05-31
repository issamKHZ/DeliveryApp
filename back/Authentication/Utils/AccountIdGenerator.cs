using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authentication.Enum;

namespace Authentication.Utils
{
    public class AccountIdGenerator
    {
        private static readonly DateTime ReferenceDate = new DateTime(2020, 1, 1);

        public static string GenerateAccountId(string email, Roles role)
        {
            string prefix = GetRolePrefix(role);
            string shortTimestamp = EncodeTimestamp(DateTime.UtcNow);
            string emailCode = EncodeEmail(email);

            return $"{prefix}-{shortTimestamp}-{emailCode}";
        }

        private static string GetRolePrefix(Roles role) => role switch
        {
            Roles.ENTREPRISE => "ENT",
            Roles.LIVREUR => "LIV",
            Roles.ADMIN => "ADM",
            _ => "USR"
        };

        private static string EncodeTimestamp(DateTime date)
        {
            // Minutes depuis la date de référence
            var minutes = (int)(date - ReferenceDate).TotalMinutes;
            return Base36Encode(minutes).PadLeft(4, '0').ToUpper();
        }

        private static string EncodeEmail(string email)
        {
            using var md5 = System.Security.Cryptography.MD5.Create();
            byte[] hash = md5.ComputeHash(System.Text.Encoding.UTF8.GetBytes(email));
            // Prends les 2 premiers octets pour 16 bits
            int shortHash = (hash[0] << 8) + hash[1];
            return Base36Encode(shortHash).PadLeft(4, '0').ToUpper();
        }

        private static string Base36Encode(int value)
        {
            const string chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            string result = "";
            do
            {
                result = chars[value % 36] + result;
                value /= 36;
            } while (value > 0);
            return result;
        }
    }
}