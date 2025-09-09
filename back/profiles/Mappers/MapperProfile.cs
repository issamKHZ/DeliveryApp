using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using profiles.Data;
using profiles.Dtos;
using profiles.Dtos.Entreprise;
using profiles.Dtos.Livreur;
using profiles.Models;

namespace profiles.Mappers
{
    public class MapperProfile : Profile
    {
        public MapperProfile()
        {
            configureMapping();
        }

        public void configureMapping()
        {
            // Entreprise → Entreprise Dto (base)
            CreateMap<Entreprise, EntrepriseDto>()
            .ForMember(dest => dest.Image, opt => opt.Ignore())
            .ForMember(dest => dest.ImageResult, opt => opt.Ignore())
            // .ForMember(dest => dest.Domiciliation, opt => opt.MapFrom(src => src.DomicilationNavigation))
            .ForMember(dest => dest.Responsable, opt => opt.MapFrom(src => src.Responsable))
            .ForMember(dest => dest.ActivitySector, opt => opt.MapFrom(src => src.CollectionItems.Select(c => c.Code).ToList()))
            .ForMember(dest => dest.Status, opt => opt.Ignore());

            CreateMap<Responsable, ResponsableDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ID))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                .ForMember(dest => dest.Lastname, opt => opt.MapFrom(src => src.Lastname))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.Phone));

            CreateMap<DB_File, FIleDto>();

            // Livreur → Livreur Dto (base)
            CreateMap<Livreur, LivreurDto>()
                .ForMember(dest => dest.Status, opt => opt.Ignore());


            // EntrepriseSubDto → Entreprsie
            CreateMap<EntrepriseSubscibedDto, Entreprise>()
                .ForMember(dest => dest.ID, opt => opt.MapFrom(src => src.AccountId))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.Adresse, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.Postal, opt => opt.MapFrom(src => src.PostalCode))
                .ForMember(dest => dest.StatusID, opt => opt.Ignore());

            // LivreurSubDto → Livreur
            CreateMap<LivreurSubscribedDto, Livreur>()
                .ForMember(dest => dest.ID, opt => opt.MapFrom(src => src.AccountId))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.FirstName))
                .ForMember(dest => dest.Lastname, opt => opt.MapFrom(src => src.LastName))
                .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.PhoneNumber))
                .ForMember(dest => dest.Adresse, opt => opt.MapFrom(src => src.Address))
                .ForMember(dest => dest.Postal, opt => opt.MapFrom(src => src.PostalCode));

            CreateMap<Collection_Item, Collection_Item_Dto>();

            CreateMap<LivreurDto, Livreur>()
                .ForMember(dest => dest.ID, opt => opt.Ignore())
                .ForMember(dest => dest.CreationDate, opt => opt.Ignore())
                .ForMember(dest => dest.Email, opt => opt.Ignore())
                .ForMember(dest => dest.Vehicle, opt => opt.Ignore())
                .ForMember(dest => dest.Horaire, opt => opt.Ignore())
                .ForMember(dest => dest.StatusID, opt => opt.Ignore())
                .ForMember(dest => dest.HoraireNavigation, opt => opt.Ignore())
                .ForMember(dest => dest.Status, opt => opt.Ignore())
                .ForMember(dest => dest.VehicleNavigation, opt => opt.Ignore())
                .ForMember(dest => dest.CollectionItems, opt => opt.Ignore());
        }       
    }
}