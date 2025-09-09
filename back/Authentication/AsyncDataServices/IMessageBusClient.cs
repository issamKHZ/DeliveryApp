using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Authentication.Dtos.Entreprise;
using Authentication.Dtos.Livreur;

namespace Authentication.AsyncDataServices
{
    public interface IMessageBusClient
    {
        void PublishEntrepriseProfil(EntreprisePublishedDto entrepriseDto);
        void PublishLivreurProfil(LivreurPublishedDto livreurDto);
    }
}