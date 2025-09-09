using System.Text.Json.Serialization;
using Orders.Data;
using Microsoft.EntityFrameworkCore;
using Orders.Midlewares;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Orders.Services;
using Orders.Data.Repositories;
using Orders.Mapper;
using Orders.Services.Interfaces;
using Orders.Services.Implementation;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// Add services
builder.Services.AddScoped<ISitesService, SitesService>();
builder.Services.AddScoped<IDisponibilityService, DisponibilityService>();
builder.Services.AddScoped<IOrderInfosService, OrderInfosService>();

// Add Repositories
builder.Services.AddScoped<ISitesRepo, SitesRepo>();
builder.Services.AddScoped<ICitiesRepo, CitiesRepo>();
builder.Services.AddScoped<IScheduleRepo, ScheduleRepo>();
builder.Services.AddScoped<ICollectionItemsRepo, CollectionItemsRepo>();


// Add Mapper
builder.Services.AddAutoMapper(typeof(MapperProfile));



builder.Services.AddControllers().AddJsonOptions(opts =>
{
    opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

// Configure SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));


// Configure Cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


// Congifure JWT
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = jwtSettings["Key"] ?? throw new InvalidOperationException("JWT Key is missing in configuration.");
var encodedKey = Encoding.UTF8.GetBytes(key);


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings["Issuer"],
            ValidAudience = jwtSettings["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(encodedKey)
        };
    });


builder.Services.AddAuthorization();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

PrepDb.PrepPopulation(app);

// Exception handler
app.UseMiddleware<ExceptionsMidleware>();

app.UseAuthentication();
app.UseAuthorization();


app.UseHttpsRedirection();


app.UseCors("AllowAngular");

app.Run();

