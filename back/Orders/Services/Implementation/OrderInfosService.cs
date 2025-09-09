using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using AutoMapper;
using Orders.Data.Repositories;
using Orders.Dtos.CollectionItems;
using Orders.Models;
using Orders.Services.Interfaces;

namespace Orders.Services.Implementation
{
    public class OrderInfosService : IOrderInfosService
    {
        private readonly ICollectionItemsRepo _collectionRepo;
        private readonly IMapper _mapper;

        public OrderInfosService(ICollectionItemsRepo collectionRepo,
                                IMapper mapper
                                )
        {
            _collectionRepo = collectionRepo;
            _mapper = mapper;
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
    }
}