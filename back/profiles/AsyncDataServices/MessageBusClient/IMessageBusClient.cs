using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using profiles.Dtos;

namespace profiles.AsyncDataServices.MessageBusClient
{
    public interface IMessageBusClient
    {
        void PublishUserInfos(UserInfosPublishedDto infos);
    }

}