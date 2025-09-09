using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;

namespace Authentication.Utils
{
    public class tokenGenerator
    {
        public static string GenerateJwtToken(string name, string username, string role, bool remember, IConfiguration configuration)
        {
            var section = configuration.GetSection("Jwt");
            var key = section["Key"] ?? throw new InvalidOperationException("JWT Key is missing in configuration.");
            var encodedKey = Encoding.UTF8.GetBytes(key);

            var securityKey = new SymmetricSecurityKey(encodedKey);
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {                
                new Claim(ClaimTypes.NameIdentifier,name),
                new Claim(ClaimTypes.Name, username),
                new Claim(ClaimTypes.Role, role)
            };

            var token = new JwtSecurityToken(
                issuer: configuration["Jwt:Issuer"],
                audience: configuration["Jwt:Audience"],
                claims: claims,
                expires: remember ? DateTime.UtcNow.AddMinutes(60) : DateTime.UtcNow.AddMinutes(30),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}