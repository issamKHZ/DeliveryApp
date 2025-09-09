using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using profiles.Dtos;
using profiles.Dtos.Entreprise;

namespace profiles.Services
{
    public interface IEntrepriseService
    {
        public Task<bool> saveEntreprise(EntrepriseSubscibedDto entrepriseDto);
        public Task<EntrepriseDto> Edit(EntrepriseDto entrepriseDto);
        public Task<EntrepriseDto> GetEntreprise(string email);
        public Task<EntrepriseDto> EditGeneralInfos(EntrepriseDto entrepriseDto, string email);
        public Task<EntrepriseDto> EditAdministratifInfos(EntrepriseAdministratifDto entrepriseDto, string email);
        public Task<ICollection<Collection_Item_Dto>> GetSectors();
        public Task<bool> CheckAccountStatus(string email);
        public Task<string> GetName(string email);
    }
}