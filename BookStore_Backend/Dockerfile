FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY *.sln ./
COPY BookStore.Core/*.csproj ./BookStore.Core/
COPY BookStore.Data/*.csproj ./BookStore.Data/
COPY BookStore.Application/*.csproj ./BookStore.Application/
COPY BookStore/*.csproj ./BookStore/
COPY BookStore.Tests/*.csproj ./BookStore.Tests/

RUN dotnet restore

COPY . .
WORKDIR /src/BookStore
RUN dotnet publish -c Release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app ./
EXPOSE 5206
ENV ASPNETCORE_URLS=http://+:5206
ENTRYPOINT ["dotnet", "BookStore.API.dll"]
