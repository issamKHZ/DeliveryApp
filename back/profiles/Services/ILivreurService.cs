using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using profiles.Dtos;
using profiles.Dtos.Livreur;

namespace profiles.Services
{
    public interface ILivreurService
    {
        public Task<bool> SaveLivreur(LivreurSubscribedDto livreurDto);
        public Task<LivreurDto> Edit(LivreurDto livreurDto, string email);
        public Task<LivreurDto> GetLivreur(string email);
        public Task<ICollection<Collection_Item_Dto>> GetLangues();
        public Task<ICollection<Collection_Item_Dto>> GetVehicles();
        public Task<bool> CheckAccountStatus(string email);
        public Task<ICollection<string>> GetIdispoDays(string livreurID);
        public Task<StartEndHours> GetHoursForDay(string livreurID, string day);
        public Task<string> GetName(string email);
    }
}