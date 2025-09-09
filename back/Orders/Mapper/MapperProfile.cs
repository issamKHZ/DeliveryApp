using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Orders.Dtos.CollectionItems;
using Orders.Dtos.Schedule;
using Orders.Dtos.Sites;
using Orders.Models;
using Org.BouncyCastle.Crypto.Agreement.Srp;

namespace Orders.Mapper
{
    public class MapperProfile : Profile
    {

        public MapperProfile()
        {
            ConfigureMapping();
        }


        public void ConfigureMapping()
        {
            CreateMap<Collection_Item, Collection_Items_Dto>();

            CreateMap<Entrep_Site, SitesResultDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.ID))
                .ForMember(dest => dest.IsDest, opt => opt.MapFrom(src => src.Destinateur))
                .ForMember(dest => dest.City, opt => opt.MapFrom(src => src.City.City))
                .ForMember(dest => dest.Country, opt => opt.MapFrom(src => src.City.Country))
                .ForMember(dest => dest.DispoCode, opt => opt.MapFrom(src => src.Disponibility.Code))
                .ForMember(dest => dest.TypeCode, opt => opt.MapFrom(src => src.Type.Code));

            CreateMap<SitesResultDto, SitesResultForOrders>();

            CreateMap<AddSiteDto, Entrep_Site>()
                .ForMember(dest => dest.Destinateur, opt => opt.MapFrom(src => src.IsDest))
                .ForMember(dest => dest.City, opt => opt.Ignore())
                .ForMember(dest => dest.Disponibility, opt => opt.Ignore())
                .ForMember(dest => dest.Type, opt => opt.Ignore());

            CreateMap<Cities_Country, Cities_Dto>()
                .ForMember(dest => dest.Code, opt => opt.MapFrom(src => src.City))
                .ForMember(dest => dest.CountryCode, opt => opt.MapFrom(src => src.Country));

            CreateMap<Livreur_Schedule, ScheduleByMonth>();

            CreateMap<Livreur_Task, TaskDto>()
                .ForMember(dest => dest.StartHour, opt => opt.MapFrom(src => DateTime.Today.AddHours(src.StartHour)))
                .ForMember(dest => dest.EndHour, opt => opt.MapFrom(src => DateTime.Today.AddHours(src.EndHour)));

            CreateMap<ScheduleByMonth, Livreur_Schedule>()
                .ForMember(dest => dest.LivreurID, opt => opt.Ignore())
                .ForMember(dest => dest.Livreur_Tasks, opt => opt.MapFrom(src => src.Livreur_Tasks));

            CreateMap<TaskDto, Livreur_Task>()
                .ForMember(dest => dest.StartHour, opt => opt.MapFrom(src => src.StartHour.Hour))
                .ForMember(dest => dest.EndHour, opt => opt.MapFrom(src => src.EndHour.Hour))
                .ForMember(dest => dest.DayID, opt => opt.Ignore())
                .ForMember(dest => dest.Day, opt => opt.Ignore());
        }
    }
}