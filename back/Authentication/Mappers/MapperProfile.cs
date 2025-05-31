using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authentication.Dtos.Entreprise;
using Authentication.Dtos.Livreur;
using Authentication.Dtos.User;
using Authentication.Models;
using AutoMapper;

namespace Authentication.Mappers
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            // UserRegistrationDto → User (base)
            CreateMap<UserRegistrationDto, User>()
                .ForMember(dest => dest.PasswordHash, opt => opt.Ignore())
                .ForMember(dest => dest.RoleId, opt => opt.Ignore())
                .ForMember(dest => dest.StatusId, opt => opt.Ignore())
                .ForMember(dest => dest.Entreprise, opt => opt.Ignore())
                .ForMember(dest => dest.Role, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore());

            // EntrepriseRegistrationDto → Entreprise
            CreateMap<EntrepriseRegistrationDto, Entreprise>()
                .ForMember(dest => dest.CreationDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => "France"))
                .ForMember(dest => dest.PostalCode, opt => opt.MapFrom(src => src.PostalCode.ToString()))
                .ForMember(dest => dest.IdNavigation, opt => opt.Ignore());


            // LivreurRegistrationDto → Livreur (si tu as un modèle Livreur)
            CreateMap<LivreurRegistrationDto, Livreur>()
                .ForMember(dest => dest.CreationDate, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => "France"))
                .ForMember(dest => dest.IdNavigation, opt => opt.Ignore());
        }
    }
}