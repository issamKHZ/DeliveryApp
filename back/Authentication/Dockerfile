FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY . .
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app

COPY --from=build /app/publish .
COPY appsettings*.json ./     

ENV ASPNETCORE_ENVIRONMENT=Production

COPY Templates /app/Templates

ENTRYPOINT ["dotnet", "Authentication.dll"]
