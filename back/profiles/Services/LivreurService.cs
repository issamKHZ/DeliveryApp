using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using profiles.AsyncDataServices.MessageBusClient;
using profiles.Data;
using profiles.Data.Repositories;
using profiles.Dtos;
using profiles.Dtos.Livreur;
using profiles.Enumerations;
using profiles.Models;

namespace profiles.Services
{
    public class LivreurService : ILivreurService
    {
        private readonly IMapper _mapper;
        private readonly AppDbContext _context;
        private readonly ILivreurRepo _livreurRepo;
        private readonly ITimeService _timeService;
        private readonly IMessageBusClient _messageBus;

        public LivreurService(
            IMapper mapper,
            AppDbContext context,
            ILivreurRepo livreurRepo,
            ITimeService timeService,
            IMessageBusClient messageBus
            )
        {
            _mapper = mapper;
            _context = context;
            _livreurRepo = livreurRepo;
            _timeService = timeService;
            _messageBus = messageBus;
        }

        public async Task<LivreurDto> GetLivreur(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new HttpRequestException("Email cannot be empty", null, HttpStatusCode.BadRequest);

            var livreur = await _livreurRepo.getLivreurByMail(email)
                ?? throw new HttpRequestException("Livreur not found", null, HttpStatusCode.NotFound);

            var livreurDto = _mapper.Map<LivreurDto>(livreur);

            // Map status
            livreurDto.Status = new UserStatusDto
            {
                Code = livreur.Status.Code,
                Severity = livreur.Status.Severity
            };

            // Map languages
            livreurDto.Langues = livreur.CollectionItems.Select(l => l.Code).ToList();

            // Map vehicle
            var vehicle = await _livreurRepo.GetVehicleWithIncludes(livreur.Vehicle);
            MapVehicleToDto(vehicle, livreurDto, livreur.ID);

            // Map files
            MapFilesToDto(livreur, vehicle, livreurDto);

            //Map Schedule
            var horaires = await _livreurRepo.GetHorairesWithIncludes(livreur.Horaire);
            MapHorairesToSchedule(horaires, livreurDto);

            return livreurDto;
        }

        private void MapHorairesToSchedule(Horaire? horaires, LivreurDto livreurDto)
        {
            if (horaires == null)
            {
                livreurDto.Horaires = null;
            }
            else
            {
                livreurDto.Horaires = _timeService.ConvertHoraireToScheduleDto(horaires);
            }
        }

        public async Task<bool> SaveLivreur(LivreurSubscribedDto livreurDto)
        {
            if (livreurDto == null)
                throw new HttpRequestException("Invalid livreur data", null, HttpStatusCode.BadRequest);

            var livreur = _mapper.Map<Livreur>(livreurDto);
            var status = await _context.UserStatuses
                .AsNoTracking()
                .FirstOrDefaultAsync(s => s.Code == livreurDto.StatusDto.Code);

            if (status != null)
            {
                livreur.StatusID = status.Id;
            }

            var vehicleType = await _context.Collection_Items
                .FirstAsync(t => t.Code == livreurDto.VehicleType);

            livreur.VehicleNavigation = new Vehicle
            {
                Matricule = livreurDto.AccountId,
                TypeNavigation = vehicleType
            };

            await _livreurRepo.AddLivreurAsync(livreur);
            return true;
        }

        public async Task<LivreurDto> Edit(LivreurDto livreurDto, string email)
        {
            ArgumentNullException.ThrowIfNull(livreurDto);

            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty", nameof(email));

            var account = await _livreurRepo.getLivreurByID(livreurDto.ID)
                ?? throw new HttpRequestException("Livreur not found", null, HttpStatusCode.NotFound);

            UpdateAccountProperties(account, livreurDto);
            await UpdateLanguages(account, livreurDto);
            await UpdateProfileImage(account, livreurDto);
            await UpdateVehicleImage(account, livreurDto);
            await UpdateVehicleDetails(account, livreurDto);
            await UpdateAssuranceFile(account, livreurDto);
            await UpdatePermisFile(account, livreurDto);
            await UpdateScheduleInfos(account, livreurDto);

            await _context.SaveChangesAsync();

            MapFilesToDto(account, account.VehicleNavigation, livreurDto);

            livreurDto.Status = new UserStatusDto
            {
                Code = account.Status.Code,
                Severity = account.Status.Severity
            };

            livreurDto.CreationDate = account.CreationDate;
            // livreurDto.Rib = MaskRIB(account.RIB);

            return livreurDto;
        }

        // private string MaskRIB(string? rib)
        // {
        //     if (string.IsNullOrWhiteSpace(rib))
        //         return string.Empty;

        //     // Découper en groupes
        //     var groups = rib.Split(' ', StringSplitOptions.RemoveEmptyEntries);

        //     // Vérifier au moins 4 groupes
        //     if (groups.Length < 4)
        //         return string.Empty;

        //     // Construire le résultat
        //     string masked = groups[0] + " "
        //                   + string.Join(" ", Enumerable.Repeat("****", groups.Length - 2))
        //                   + " " + groups[^1];

        //     return masked;
        // }


        private async Task UpdateScheduleInfos(Livreur account, LivreurDto livreurDto)
        {
            if (livreurDto.Horaires == null || !livreurDto.Horaires.Any())
            {
                // Si aucun horaire n'est fourni, supprimer l'horaire existant
                await RemoveExistingSchedule(account);
                return;
            }

            Horaire? horaireEntity;

            if (account.Horaire.HasValue)
            {
                horaireEntity = await _context.Horaires
                    .FirstOrDefaultAsync(h => h.ID == account.Horaire);

                if (horaireEntity == null)
                {
                    horaireEntity = new Horaire();
                    _context.Horaires.Add(horaireEntity);
                }
                else
                {
                    ResetAllDays(horaireEntity);
                }
            }
            else
            {
                horaireEntity = new Horaire();
                _context.Horaires.Add(horaireEntity);
            }

            foreach (var scheduleDto in livreurDto.Horaires)
            {
                UpdateDaySchedule(horaireEntity, scheduleDto);
            }

            await _context.SaveChangesAsync();

            account.Horaire = horaireEntity.ID;
            account.HoraireNavigation = horaireEntity;
        }

        private async Task RemoveExistingSchedule(Livreur account)
        {
            if (account.Horaire.HasValue)
            {
                var existingHoraire = await _context.Horaires
                    .FirstOrDefaultAsync(h => h.ID == account.Horaire.Value);

                if (existingHoraire != null)
                {
                    _context.Horaires.Remove(existingHoraire);
                }
                account.Horaire = null;
                account.HoraireNavigation = null;
            }
        }

        private void ResetAllDays(Horaire horaire)
        {
            horaire.MONDAY = null;
            horaire.TUESDAY = null;
            horaire.WEDNESDAY = null;
            horaire.THURSDAY = null;
            horaire.FRIDAY = null;
            horaire.SATURDAY = null;
            horaire.SANDAY = null;
        }

        private void UpdateDaySchedule(Horaire horaire, ScheduleDto scheduleDto)
        {
            if (scheduleDto.Dispo == false)
            {
                SetDayAsUnavailable(horaire, scheduleDto.Day);
            }
            else if (scheduleDto.StartHour.HasValue && scheduleDto.EndHour.HasValue)
            {
                SetDayWorkingHours(horaire, scheduleDto.Day, scheduleDto.StartHour.Value, scheduleDto.EndHour.Value);
            }

        }

        private void SetDayAsUnavailable(Horaire horaire, string day)
        {
            switch (day.ToUpper())
            {
                case "MONDAY":
                    horaire.MONDAY = "INDISPO";
                    break;
                case "TUESDAY":
                    horaire.TUESDAY = "INDISPO";
                    break;
                case "WEDNESDAY":
                    horaire.WEDNESDAY = "INDISPO";
                    break;
                case "THURSDAY":
                    horaire.THURSDAY = "INDISPO";
                    break;
                case "FRIDAY":
                    horaire.FRIDAY = "INDISPO";
                    break;
                case "SATURDAY":
                    horaire.SATURDAY = "INDISPO";
                    break;
                case "SUNDAY":
                    horaire.SANDAY = "INDISPO";
                    break;
            }
        }

        private void SetDayWorkingHours(Horaire horaire, string day, DateTime start, DateTime end)
        {
            var timeFormat = "HH:mm";
            var timeRange = $"{start.ToString(timeFormat)}-{end.ToString(timeFormat)}";

            switch (day.ToUpper())
            {
                case "MONDAY":
                    horaire.MONDAY = timeRange;
                    break;
                case "TUESDAY":
                    horaire.TUESDAY = timeRange;
                    break;
                case "WEDNESDAY":
                    horaire.WEDNESDAY = timeRange;
                    break;
                case "THURSDAY":
                    horaire.THURSDAY = timeRange;
                    break;
                case "FRIDAY":
                    horaire.FRIDAY = timeRange;
                    break;
                case "SATURDAY":
                    horaire.SATURDAY = timeRange;
                    break;
                case "SUNDAY":
                    horaire.SANDAY = timeRange;
                    break;
            }
        }
        public async Task<ICollection<Collection_Item_Dto>> GetLangues()
        {
            var type = await _context.Collections_Types
                .FirstAsync(t => t.Code == "Languages");

            var langues = await _context.Collection_Items
                .Where(c => c.Collection_Id == type.Id)
                .ToListAsync();

            return _mapper.Map<ICollection<Collection_Item_Dto>>(langues);
        }

        public async Task<ICollection<Collection_Item_Dto>> GetVehicles()
        {
            var type = await _context.Collections_Types
                .FirstAsync(t => t.Code == "VehicleTypes");

            var vehicles = await _context.Collection_Items
                .Where(c => c.Collection_Id == type.Id)
                .ToListAsync();

            return _mapper.Map<ICollection<Collection_Item_Dto>>(vehicles);
        }

        public async Task<bool> CheckAccountStatus(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty", nameof(email));

            var livreur = await _livreurRepo.getLivreurByMail(email);
            if (livreur?.Status == null) return false;

            var validStatuses = new[]
            {
                StatusEnum.ACTIF.ToString(),
                StatusEnum.DISPONIBLE.ToString(),
                StatusEnum.EN_LIVRAISON.ToString(),
                StatusEnum.RESERVED.ToString()
            };

            return validStatuses.Contains(livreur.Status.Code);
        }

        #region Private Methods       

        private static void MapVehicleToDto(Vehicle vehicle, LivreurDto livreurDto, string livreurId)
        {
            livreurDto.TypeVehicle = vehicle.TypeNavigation.Code;
            livreurDto.Modele = vehicle.Model;
            livreurDto.Matricule = vehicle.Matricule == livreurId ? null : vehicle.Matricule;
        }

        private static void MapFilesToDto(Livreur livreur, Vehicle vehicle, LivreurDto livreurDto)
        {
            livreurDto.Email = livreur.Email;
            if (livreur.ImgNavigation != null)
            {
                livreurDto.ProfilImgResult = CreateFileContentResult(livreur.ImgNavigation);
            }

            if (vehicle.ImgNavigation != null)
            {
                livreurDto.VehicleImgResult = CreateFileContentResult(vehicle.ImgNavigation);
            }

            if (livreur.VehicleNavigation.AssuranceNavigation != null)
            {
                livreurDto.AssuranceResult = CreateFileContentResult(vehicle.AssuranceNavigation, vehicle.AssuranceNavigation.Nom);
            }

            if (livreur.VehicleNavigation.PermisNavigation != null)
            {
                livreurDto.PermisResult = CreateFileContentResult(vehicle.PermisNavigation, vehicle.PermisNavigation.Nom);
            }
        }

        private static FileContentResult CreateFileContentResult(DB_File file, string fileName = null)
        {
            var result = new FileContentResult(file.Donnees, file.TypeMime);
            if (fileName != null)
            {
                result.FileDownloadName = fileName;
            }
            return result;
        }

        private void UpdateAccountProperties(Livreur account, LivreurDto livreurDto)
        {
            account.Name = livreurDto.Name;
            account.Lastname = livreurDto.Lastname;
            account.Phone = livreurDto.Phone;
            account.Adresse = livreurDto.Adresse;
            account.Postal = livreurDto.Postal;
            account.City = livreurDto.City;
            account.Country = livreurDto.Country;
            account.Age = livreurDto.Age;
            // if (!string.IsNullOrEmpty(livreurDto.Rib) && !livreurDto.Rib.Contains('*'))
            // {
            //     account.RIB = livreurDto.Rib;   
            // }            
            UserInfosPublishedDto infosToPublish = new UserInfosPublishedDto()
            {
                ID = account.ID,
                Name = livreurDto.Name,
                PhoneNumber = livreurDto.Phone,
                Role = "LIVREUR"
            };

            _messageBus.PublishUserInfos(infosToPublish);
        }

        private async Task UpdateLanguages(Livreur account, LivreurDto livreurDto)
        {
            account.CollectionItems.Clear();

            if (livreurDto.Langues == null) return;

            var langueType = await _context.Collections_Types.FirstAsync(t => t.Code == "Languages");
            var langues = await _context.Collection_Items
                .Where(c => c.Collection_Id == langueType.Id)
                .ToListAsync();

            foreach (var code in livreurDto.Langues)
            {
                var langue = langues.FirstOrDefault(s => s.Code == code);
                if (langue != null && !account.CollectionItems.Any(ci => ci.Id == langue.Id))
                {
                    account.CollectionItems.Add(langue);
                }
            }
        }

        private async Task UpdateProfileImage(Livreur account, LivreurDto livreurDto)
        {
            if (livreurDto.ProfilImg != null)
            {
                await using var memoryStream = new MemoryStream();
                await livreurDto.ProfilImg.CopyToAsync(memoryStream);

                if (account.ImgNavigation == null)
                {
                    account.ImgNavigation = new DB_File();
                }

                UpdateFileProperties(account.ImgNavigation, livreurDto.ProfilImg, memoryStream.ToArray());
            }
            else
            {
                await RemoveFileIfExists(account.Img);
                account.Img = null;
                account.ImgNavigation = null;
            }
        }

        private async Task UpdateVehicleImage(Livreur account, LivreurDto livreurDto)
        {
            if (livreurDto.VehicleImg != null)
            {
                await using var memoryStream = new MemoryStream();
                await livreurDto.VehicleImg.CopyToAsync(memoryStream);

                if (account.VehicleNavigation.ImgNavigation == null)
                {
                    account.VehicleNavigation.ImgNavigation = new DB_File();
                }

                UpdateFileProperties(account.VehicleNavigation.ImgNavigation, livreurDto.VehicleImg, memoryStream.ToArray());
            }
            else
            {
                await RemoveFileIfExists(account.VehicleNavigation.Img);
                account.VehicleNavigation.Img = null;
                account.VehicleNavigation.ImgNavigation = null;
            }
        }

        private async Task UpdateVehicleDetails(Livreur account, LivreurDto livreurDto)
        {
            account.VehicleNavigation.Model = livreurDto.Modele;
            account.VehicleNavigation.Matricule = livreurDto.Matricule ?? livreurDto.ID;

            var type = await _context.Collection_Items
                .FirstOrDefaultAsync(c => c.Code == livreurDto.TypeVehicle);

            if (type != null)
            {
                account.VehicleNavigation.TypeNavigation = type;
            }
        }

        private async Task UpdateAssuranceFile(Livreur account, LivreurDto livreurDto)
        {
            if (livreurDto.Assurance != null)
            {
                await using var memoryStream = new MemoryStream();
                await livreurDto.Assurance.CopyToAsync(memoryStream);

                if (account.VehicleNavigation.AssuranceNavigation == null)
                {
                    account.VehicleNavigation.AssuranceNavigation = new DB_File();
                }

                UpdateFileProperties(account.VehicleNavigation.AssuranceNavigation, livreurDto.Assurance, memoryStream.ToArray());
            }
            else
            {
                await RemoveFileIfExists(account.VehicleNavigation.Assurance);
                account.VehicleNavigation.Assurance = null;
                account.VehicleNavigation.AssuranceNavigation = null;
            }
        }

        private async Task UpdatePermisFile(Livreur account, LivreurDto livreurDto)
        {
            if (livreurDto.Permis != null)
            {
                await using var memoryStream = new MemoryStream();
                await livreurDto.Permis.CopyToAsync(memoryStream);

                if (account.VehicleNavigation.PermisNavigation == null)
                {
                    account.VehicleNavigation.PermisNavigation = new DB_File();
                }

                UpdateFileProperties(account.VehicleNavigation.PermisNavigation, livreurDto.Permis, memoryStream.ToArray());
            }
            else
            {
                await RemoveFileIfExists(account.VehicleNavigation.Permis);
                account.VehicleNavigation.Permis = null;
                account.VehicleNavigation.PermisNavigation = null;
            }
        }

        private static void UpdateFileProperties(DB_File file, IFormFile formFile, byte[] fileBytes)
        {
            file.Nom = formFile.FileName;
            file.TypeMime = formFile.ContentType;
            file.Taille = formFile.Length;
            file.Donnees = fileBytes;
        }

        private async Task RemoveFileIfExists(int? fileId)
        {
            if (fileId.HasValue)
            {
                var file = await _context.DB_Files.FirstOrDefaultAsync(i => i.ID == fileId);
                if (file != null)
                {
                    _context.DB_Files.Remove(file);
                }
            }
        }

        public async Task<ICollection<string>> GetIdispoDays(string livreurID)
        {
            Livreur? livreur = await _livreurRepo.getLivreurByID(livreurID);

            if (livreur == null)
            {
                throw new HttpRequestException("livreur", null, HttpStatusCode.NotFound);
            }

            if (livreur?.HoraireNavigation == null)
            {
                throw new HttpRequestException("horaire", null, HttpStatusCode.NotFound);
            }

            Horaire horaire = livreur.HoraireNavigation;

            return _timeService.GetIndispoDays(horaire);

        }

        public async Task<StartEndHours> GetHoursForDay(string livreurID, string day)
        {
            Livreur? livreur = await _livreurRepo.getLivreurByID(livreurID);

            if (livreur == null)
            {
                throw new HttpRequestException("livreur", null, HttpStatusCode.NotFound);
            }

            if (livreur?.HoraireNavigation == null)
            {
                throw new HttpRequestException("NULL", null, HttpStatusCode.NotFound);
            }

            Horaire horaire = livreur.HoraireNavigation;
            return _timeService.GetHoursInterval(horaire, day);
        }

        public async Task<string> GetName(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty", nameof(email));

            var account = await _livreurRepo.getLivreurByMail(email);

            if (account != null)
            {
                return account.Name;
            }

            return "";
        }


        #endregion
    }
}