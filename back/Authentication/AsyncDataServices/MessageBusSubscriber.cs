using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Authentication.Dtos;
using Authentication.Services;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Authentication.AsyncDataServices
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

            var queueName = _channel.QueueDeclare(queue: "auth_service_queue", durable: true, exclusive: false, autoDelete: false);
            _channel.QueueBind(queue: queueName, exchange: "trigger", routingKey: "InfosUser");

        }

        private async void OnMessageReceived(object? sender, BasicDeliverEventArgs ea)
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);

            if (ea.RoutingKey == "InfosUser")
            {
                var infosDto = JsonSerializer.Deserialize<UserInfosSubscibedDto>(message);
                if (infosDto != null)
                {
                    await ProcessInfos(infosDto);
                }              
            }
        }        

        private async Task ProcessInfos(UserInfosSubscibedDto dto)
        {
            if (dto != null)
            {
                try
                {
                    using (var scope = _scopeFactory.CreateScope())
                    {
                        var service = scope.ServiceProvider.GetRequiredService<IAuthService>();
                        await service.UpdateUserInfosFromProfile(dto);
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

            _channel.BasicConsume(queue: "auth_service_queue", autoAck: true, consumer: consumer);
            return Task.CompletedTask;
        }
    }
}