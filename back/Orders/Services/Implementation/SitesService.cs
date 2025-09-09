using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using Orders.Data.Repositories;
using Orders.Dtos.CollectionItems;
using Orders.Dtos.Sites;
using Orders.Models;

namespace Orders.Services
{
    public class SitesService : ISitesService
    {
        private readonly ISitesRepo _sitesRepo;
        private readonly IMapper _mapper;
        private readonly ICitiesRepo _citiesRepo;
        private readonly ICollectionItemsRepo _collectionRepo;

        public SitesService(ISitesRepo sitesRepo,
                            ICitiesRepo citiesRepo,
                            ICollectionItemsRepo collectionRepo,
                            IMapper mapper)
        {
            _sitesRepo = sitesRepo;
            _mapper = mapper;
            _citiesRepo = citiesRepo;
            _collectionRepo = collectionRepo;
        }

        public async Task<SitesResultDto> AddNewSite(AddSiteDto siteDto)
        {
            // TODO : CHECK si l'entreprise esxite dans l'app

            Entrep_Site? site = _mapper.Map<Entrep_Site>(siteDto) ?? throw new HttpRequestException("Error Inter", null, HttpStatusCode.InternalServerError);

            // Add city 
            Cities_Country city = await _citiesRepo.GetCityByCity(siteDto.City);
            site.City = city;

            // Add collectionsItems
            Collection_Item type = await _collectionRepo.GetItemByCode(siteDto.TypeCode);
            site.Type = type;

            Collection_Item dispo = await _collectionRepo.GetItemByCode(siteDto.DispoCode);
            site.Disponibility = dispo;

            await _sitesRepo.AddUserAsync(site);

            // return Dto
            return _mapper.Map<SitesResultDto>(site);

        }

        public async Task<ICollection<int>> DeleteSieges(ICollection<int> ids)
        {
            if (ids == null || ids.Count == 0)
            {
                throw new ArgumentException("La liste des IDs ne peut pas être vide", nameof(ids));
            }

            var successfullyDeletedIds = new List<int>();

            foreach (var id in ids)
            {
                try
                {
                    await _sitesRepo.RemoveSiteById(id);
                    successfullyDeletedIds.Add(id);
                }
                catch (Exception ex)
                {
                    throw new HttpRequestException($"{id}", null, HttpStatusCode.InternalServerError);
                }
            }

            await _sitesRepo.SaveChanges();

            return successfullyDeletedIds;
        }

        public async Task EditSites(ICollection<AddSiteDto> sitesDto)
        {
            if (sitesDto == null || sitesDto.Count == 0)
            {
                throw new HttpRequestException("sites", null, HttpStatusCode.BadRequest);
            }

            var errors = new List<string>();

            foreach (var siteDto in sitesDto)
            {
                try
                {
                    // Vérifier que le site existe
                    var existingSite = await _sitesRepo.GetSiteById(siteDto.Id);

                    if (existingSite == null)
                    {
                        errors.Add($"{siteDto.Id} not found");
                        continue;
                    }

                    _mapper.Map(siteDto, existingSite);
                    // Mettre à jour la ville si elle a changé
                    if (!string.IsNullOrEmpty(siteDto.City) && existingSite.City?.City != siteDto.City)
                    {
                        var city = await _citiesRepo.GetCityByCity(siteDto.City);
                        existingSite.City = city;
                    }

                    // Mettre à jour le type si nécessaire
                    if (!string.IsNullOrEmpty(siteDto.TypeCode) && existingSite.Type?.Code != siteDto.TypeCode)
                    {
                        var type = await _collectionRepo.GetItemByCode(siteDto.TypeCode);
                        existingSite.Type = type;
                    }

                    // Mettre à jour la disponibilité si nécessaire
                    if (!string.IsNullOrEmpty(siteDto.DispoCode) && existingSite.Disponibility?.Code != siteDto.DispoCode)
                    {
                        var dispo = await _collectionRepo.GetItemByCode(siteDto.DispoCode);
                        existingSite.Disponibility = dispo;
                    }

                    // // Marquer comme modifié
                    // _sitesRepo.UpdateSite(existingSite);
                    // updatedSites.Add(_mapper.Map<SitesResultDto>(existingSite));
                }
                catch (Exception ex)
                {
                    errors.Add($"Erreur lors de la modification du site {siteDto.Id}: {ex.Message}");
                }
            }

            try
            {
                await _sitesRepo.SaveChanges();
            }
            catch (Exception ex)
            {
                throw new HttpRequestException($"Erreur lors de la sauvegarde des modifications: {ex.Message}",
                                             null, HttpStatusCode.InternalServerError);
            }

            if (errors.Count > 0)
            {
                throw new HttpRequestException($"Certains sites n'ont pas pu être modifiés: {string.Join(", ", errors)}",
                                             null, HttpStatusCode.MultiStatus);
            }            
        }

        public async Task<ICollection<Cities_Dto>> GetCities()
        {
            ICollection<Cities_Country> cities = await _citiesRepo.GetAllCities();

            return _mapper.Map<ICollection<Cities_Dto>>(cities);
        }

        public async Task<ICollection<Collection_Items_Dto>> GetItems(string type)
        {
            ICollection<Collection_Item>? dispos = await _collectionRepo.GetItemsByType(type);

            if (dispos == null)
            {
                throw new HttpRequestException("Items not found", null, HttpStatusCode.NotFound);
            }
            else
            {
                return _mapper.Map<ICollection<Collection_Items_Dto>>(dispos);
            }
        }

        public async Task<ICollection<SitesResultDto>> GetSites(string entrepriseID)
        {
            if (string.IsNullOrWhiteSpace(entrepriseID))
                throw new ArgumentException("ID cannot be empty", nameof(entrepriseID));

            ICollection<Entrep_Site>? sites = await this._sitesRepo.GetSitesByEntrepID(entrepriseID) ?? throw new HttpRequestException("Sites Not Found", null, HttpStatusCode.NotFound);
            return _mapper.Map<ICollection<SitesResultDto>>(sites);
        }
    }
}