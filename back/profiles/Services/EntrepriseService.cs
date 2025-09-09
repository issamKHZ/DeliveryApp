using System.Collections.ObjectModel;
using System.Net;
using System.Reflection;
using System.Text.Json;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using profiles.AsyncDataServices.MessageBusClient;
using profiles.Data;
using profiles.Data.Repositories;
using profiles.Dtos;
using profiles.Dtos.Entreprise;
using profiles.Enumerations;
using profiles.Models;

namespace profiles.Services
{
    public class EntrepriseService : IEntrepriseService
    {
        private readonly IEntrepriseRepo entrepRepo;
        private readonly IMapper mapper;
        private readonly AppDbContext context;
        private readonly IMessageBusClient messageBus;

        public EntrepriseService(
            IEntrepriseRepo _entrepRepo,
            IMapper _mapper,
            AppDbContext _context,
            IMessageBusClient _messageBus
            )
        {
            entrepRepo = _entrepRepo;
            mapper = _mapper;
            context = _context;
            messageBus = _messageBus;
        }

        public async Task<bool> saveEntreprise(EntrepriseSubscibedDto entrepriseDto)
        {
            if (entrepriseDto != null)
            {
                Entreprise entreprise = mapper.Map<Entreprise>(entrepriseDto);
                var status = await context.UserStatuses
                    .AsNoTracking()
                    .FirstOrDefaultAsync(s => s.Code == entrepriseDto.StatusDto.Code);


                if (status != null)
                {
                    entreprise.StatusID = status.Id;
                }

                await entrepRepo.AddEntrepriseAsync(entreprise);

                return true;
            }
            else
            {
                throw new HttpRequestException("save problem", null, HttpStatusCode.BadRequest);
            }
        }

        public Task<EntrepriseDto> Edit(EntrepriseDto entrepriseDto)
        {
            throw new NotImplementedException();
        }

        public async Task<EntrepriseDto> GetEntreprise(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                throw new HttpRequestException("email null", null, HttpStatusCode.BadRequest);
            }

            Entreprise? entreprise = await entrepRepo.getEntrepriseByMail(email);

            if (entreprise == null)
            {
                throw new HttpRequestException("Entreprise not exist", null, HttpStatusCode.NotFound);
            }

            EntrepriseDto entrepriseDto = mapper.Map<EntrepriseDto>(entreprise);
            UserStatusDto status = new UserStatusDto
            {
                Code = entreprise.Status.Code,
                Severity = entreprise.Status.Severity
            };
            entrepriseDto.Status = status;

            // Recuperate Image if its existe 
            if (entreprise.Img != null)
            {
                entrepriseDto.ImageResult = new FileContentResult(entreprise.ImgNavigation?.Donnees, entreprise.ImgNavigation?.TypeMime);
            }

            if (entreprise.DomicilationNavigation != null)
            {
                entrepriseDto.DomicileResult = new FileContentResult(entreprise.DomicilationNavigation?.Donnees, entreprise.DomicilationNavigation?.TypeMime)
                {
                    FileDownloadName = entreprise.DomicilationNavigation?.Nom
                };
            }

            return entrepriseDto;
        }

        public async Task<EntrepriseDto> EditGeneralInfos(EntrepriseDto entrepriseDto, string email)
        {
            ArgumentNullException.ThrowIfNull(entrepriseDto);

            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty", nameof(email));

            var account = await entrepRepo.getEntrepriseById(entrepriseDto.ID)
                ?? throw new HttpRequestException("Entreprise not found", null, HttpStatusCode.NotFound);


            if (account.Email != email)
                throw new HttpRequestException("Unauthorized operation", null, HttpStatusCode.Unauthorized);


            account.Name = entrepriseDto.Name;
            account.Email = entrepriseDto.Email;
            account.Phone = entrepriseDto.Phone;
            account.Web = entrepriseDto.Web;

            UserInfosPublishedDto infosToPublish = new UserInfosPublishedDto()
            {
                ID = account.ID,
                Name = entrepriseDto.Name,
                PhoneNumber = entrepriseDto.Phone,
                Role = "ENTREPRISE"
            };


            messageBus.PublishUserInfos(infosToPublish);


            if (entrepriseDto.Image != null)
            {
                await using var memoryStream = new MemoryStream();
                await entrepriseDto.Image.CopyToAsync(memoryStream);
                byte[] fileBytes = memoryStream.ToArray();

                if (account.ImgNavigation == null)
                {
                    account.ImgNavigation = new DB_File();
                }

                account.ImgNavigation.Nom = entrepriseDto.Image.FileName;
                account.ImgNavigation.TypeMime = entrepriseDto.Image.ContentType;
                account.ImgNavigation.Taille = entrepriseDto.Image.Length;
                account.ImgNavigation.Donnees = fileBytes;

            }
            else
            {
                if (account.Img != null)
                {
                    DB_File image = await context.DB_Files.FirstAsync(i => i.ID == account.Img);
                    if (image != null)
                    {
                        context.DB_Files.Remove(image);
                    }
                }
                account.Img = null;
                account.ImgNavigation = null;
            }
            // Sauvegarde atomique
            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                throw new HttpRequestException("Database update failed", ex, HttpStatusCode.InternalServerError);
            }

            var dto = mapper.Map<EntrepriseDto>(account);

            UserStatusDto status = new UserStatusDto
            {
                Code = account.Status.Code,
                Severity = account.Status.Severity
            };

            //Envoyer l'image
            if (account.ImgNavigation != null)
            {
                dto.ImageResult = new FileContentResult(account.ImgNavigation?.Donnees, account.ImgNavigation?.TypeMime);
            }

            // Envoyer le fichier
            if (account.DomicilationNavigation != null)
            {
                dto.DomicileResult = new FileContentResult(account.DomicilationNavigation?.Donnees, account.DomicilationNavigation?.TypeMime)
                {
                    FileDownloadName = account.DomicilationNavigation?.Nom
                };
            }

            dto.Status = status;
            return dto;
        }

        public async Task<EntrepriseDto> EditAdministratifInfos(EntrepriseAdministratifDto entrepriseDto, string email)
        {
            if (entrepriseDto == null)
                throw new ArgumentNullException(nameof(entrepriseDto));

            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty", nameof(email));

            var account = await entrepRepo.getEntrepriseById(entrepriseDto.ID)
                ?? throw new HttpRequestException("Entreprise not found", null, HttpStatusCode.NotFound);



            account.Adresse = entrepriseDto.Adresse;
            account.Postal = entrepriseDto.PostalCode;
            account.City = entrepriseDto.City;
            account.Country = entrepriseDto.Country;
            account.Siret = entrepriseDto.SiretNumber;
            account.LivraisonNotice = entrepriseDto.Description;


            var responsableFields = new[] {
                entrepriseDto.ResponsableName,
                entrepriseDto.ResponsableEmail,
                entrepriseDto.ResponsablePhone
            };

            bool allEmpty = responsableFields.All(f => string.IsNullOrEmpty(f));
            bool allFilled = responsableFields.All(f => !string.IsNullOrEmpty(f));

            if (!allEmpty && !allFilled)
            {
                throw new HttpRequestException(
                    "Tous les champs du responsable doivent être remplis ou tous vides",
                    null,
                    HttpStatusCode.BadRequest
                );
            }


            if (entrepriseDto?.ResponsableEmail != null)
            {
                if (account.Responsable == null)
                {
                    account.Responsable = new Responsable();
                }

                string[] fullname = DecomposeFullName(entrepriseDto.ResponsableName);
                account.Responsable.Name = fullname?[0];
                account.Responsable.Lastname = fullname?.Length > 1 ? fullname[1] : null;
                account.Responsable.Email = entrepriseDto.ResponsableEmail;
                account.Responsable.Phone = entrepriseDto.ResponsablePhone;
            }
            else
            {
                if (account.Responsable != null)
                {
                    Responsable respo = await context.Responsables.FirstAsync(r => r.ID == account.Responsable.ID);
                    context.Responsables.Remove(respo);
                }
                account.Responsable = null;
            }



            var sectorType = await context.Collections_Types.FirstAsync(t => t.Code == "Secteurs");
            var sectors = await context.Collection_Items
                .Where(c => c.Collection_Id == sectorType.Id)
                .ToListAsync();

            account.CollectionItems.Clear();

            if (entrepriseDto?.ActivitySector != null)
            {
                foreach (var code in entrepriseDto.ActivitySector)
                {
                    var sector = sectors.FirstOrDefault(s => s.Code == code);
                    if (sector != null && !account.CollectionItems.Any(ci => ci.Id == sector.Id))
                    {
                        account.CollectionItems.Add(sector);
                    }
                }
            }


            // Change domicile file
            if (entrepriseDto?.DomicileFile != null)
            {
                await using var memoryStream = new MemoryStream();
                await entrepriseDto.DomicileFile.CopyToAsync(memoryStream);
                byte[] fileBytes = memoryStream.ToArray();

                if (account.DomicilationNavigation == null)
                {
                    account.DomicilationNavigation = new DB_File();
                }

                account.DomicilationNavigation.Nom = entrepriseDto.DomicileFile.FileName;
                account.DomicilationNavigation.TypeMime = entrepriseDto.DomicileFile.ContentType;
                account.DomicilationNavigation.Taille = entrepriseDto.DomicileFile.Length;
                account.DomicilationNavigation.Donnees = fileBytes;

            }
            else
            {
                if (account.Domicilation != null)
                {
                    DB_File file = await context.DB_Files.FirstAsync(i => i.ID == account.Domicilation);
                    if (file != null)
                    {
                        context.DB_Files.Remove(file);
                    }
                }
                account.Domicilation = null;
                account.DomicilationNavigation = null;
            }

            await context.SaveChangesAsync();
            var dto = mapper.Map<EntrepriseDto>(account);

            //Envoyer l'image
            if (account.ImgNavigation != null)
            {
                dto.ImageResult = new FileContentResult(account.ImgNavigation?.Donnees, account.ImgNavigation?.TypeMime);
            }

            // Envoyer le fichier
            if (account.DomicilationNavigation != null)
            {
                dto.DomicileResult = new FileContentResult(account.DomicilationNavigation?.Donnees, account.DomicilationNavigation?.TypeMime)
                {
                    FileDownloadName = account.DomicilationNavigation?.Nom
                };
            }
            UserStatusDto status = new UserStatusDto
            {
                Code = account.Status.Code,
                Severity = account.Status.Severity
            };
            dto.Status = status;
            return dto;
        }


        private static string[] DecomposeFullName(string name)
        {
            if (name != null && name.Contains(' '))
            {
                var parts = name.Split(' ');
                return [parts[0], parts[1]];
            }

            return [name ?? "", ""];
        }

        public async Task<ICollection<Collection_Item_Dto>> GetSectors()
        {
            Collections_Type type = await context.Collections_Types
                .FirstAsync(t => t.Code == "Secteurs");

            ICollection<Collection_Item> sectors = context.Collection_Items
                .Where(c => c.Collection_Id == type.Id)
                .ToList();

            var result = mapper.Map<ICollection<Collection_Item_Dto>>(sectors);

            return result;
        }

        public async Task<bool> CheckAccountStatus(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty", nameof(email));

            var entreprise = await entrepRepo.getEntrepriseByMail(email);

            return entreprise?.Status != null &&
                   new[]
                   {
               StatusEnum.ACTIF.ToString(),
               StatusEnum.DISPONIBLE.ToString(),
               StatusEnum.EN_LIVRAISON.ToString(),
               StatusEnum.RESERVED.ToString()
                   }.Contains(entreprise.Status.Code);
        }

        public async Task<string> GetName(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                throw new ArgumentException("Email cannot be empty", nameof(email));

            var account = await entrepRepo.getEntrepriseByMail(email);

            if (account != null)
            {
                return account.Name;
            }

            return "d";
        }
    }


}