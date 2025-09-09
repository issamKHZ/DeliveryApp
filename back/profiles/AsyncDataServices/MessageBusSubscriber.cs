using System;
using System.Net;
using System.Text;
using System.Text.Json;
using profiles.Dtos.Entreprise;
using profiles.Dtos.Livreur;
using profiles.Services;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace profiles.AsyncDataServices
{
    public class MessageBusSubscriber : BackgroundService, IDisposable
    {
        private readonly IConfiguration _configuration;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IConnection _connection;
        private readonly IModel _channel;

        public MessageBusSubscriber(
            IConfiguration configuration,
            IServiceScopeFactory scopeFactory
            )
        {
            _configuration = configuration;
            _scopeFactory = scopeFactory;

            var factory = new ConnectionFactory()
            {
                HostName = _configuration["RabbitMQ:Host"] ?? "localhost",
                Port = int.Parse(_configuration["RabbitMQ:Port"] ?? "5672"),
                UserName = _configuration["RabbitMQ:Username"] ?? "guest",
                Password = _configuration["RabbitMQ:Password"] ?? "guest"
            };

            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();
            _channel.ExchangeDeclare(exchange: "trigger", type: ExchangeType.Direct);

            var queueName = _channel.QueueDeclare(queue: "profiles_service_queue", durable: true, exclusive: false, autoDelete: false);
            _channel.QueueBind(queue: queueName, exchange: "trigger", routingKey: "Entreprise");
            _channel.QueueBind(queue: queueName, exchange: "trigger", routingKey: "Livreur");
            
        }

        private async void OnMessageReceived(object? sender, BasicDeliverEventArgs ea)
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);

            try
            {
                switch (ea.RoutingKey)
                {
                    case "Entreprise":                        
                        var entrepriseDto = JsonSerializer.Deserialize<EntrepriseSubscibedDto>(message);                        
                        await ProcessEntreprise(entrepriseDto);
                        break;

                    case "Livreur":
                        var livreurDto = JsonSerializer.Deserialize<LivreurSubscribedDto>(message);
                        Console.WriteLine("----> " + JsonSerializer.Serialize(livreurDto));
                        await ProcessLivreur(livreurDto);
                        break;

                    default:
                        throw new HttpRequestException("receive problem", null, HttpStatusCode.BadRequest);                        
                }
            }
            catch (JsonException ex)
            {
                throw new HttpRequestException("receive problem", null, HttpStatusCode.BadRequest);
            }
        }

        private async Task ProcessEntreprise(EntrepriseSubscibedDto dto)
        {
            if (dto != null)
            {
                try
                {
                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var entrepriseService = scope.ServiceProvider.GetRequiredService<IEntrepriseService>();
                        await entrepriseService.saveEntreprise(dto); 
                    }
                }
                catch (Exception ex)
                {
                    throw new HttpRequestException("saving problem", null, HttpStatusCode.BadRequest);
                }
            }
        }

        private async Task ProcessLivreur(LivreurSubscribedDto dto)
        {
            if (dto != null)
            {
                try
                {
                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var livreurService = scope.ServiceProvider.GetRequiredService<ILivreurService>();
                        await livreurService.SaveLivreur(dto);
                    }
                }
                catch (Exception ex)
                {
                    throw new HttpRequestException("saving problem", null, HttpStatusCode.BadRequest);
                }
            }
        }

        public void Dispose()
        {
            if (_channel?.IsOpen ?? false)
            {
                _channel.Close();
                _connection.Close();
            }
        }

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            stoppingToken.ThrowIfCancellationRequested();

            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += OnMessageReceived;

            _channel.BasicConsume(queue: "profiles_service_queue", autoAck: true, consumer: consumer);
            return Task.CompletedTask;
        }
                
    }
}