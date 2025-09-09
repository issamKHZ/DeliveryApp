using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Orders.Dtos.CollectionItems;
using Orders.Dtos.Sites;

namespace Orders.Services
{
    public interface ISitesService
    {
        public Task<SitesResultDto> AddNewSite(AddSiteDto siteDto);
        public Task<ICollection<int>> DeleteSieges(ICollection<int> ids);
        public Task EditSites(ICollection<AddSiteDto> sitesDto);
        public Task<ICollection<Cities_Dto>> GetCities();
        public Task<ICollection<Collection_Items_Dto>> GetItems(string type);
        public Task<ICollection<SitesResultDto>> GetSites(string entrepriseID);
    }
}