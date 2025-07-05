using BookStore.Application.Services;
using BookStore.Core.Interfaces;
using BookStore.Data.Repositories;

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.ConfigureKestrel(o => o.ListenAnyIP(5000));

var xmlPath = builder.Configuration["BookStore:XmlFilePath"]
    ?? throw new InvalidOperationException("XmlFilePath is missing in configuration");

builder.Services.AddSingleton<IBookRepository>(new XmlBookRepository(xmlPath));

builder.Services.AddScoped<IBookService, BookService>();

builder.Services.AddMemoryCache();

var AllowSpecificOriginsPolicy = "_AllowSpecificOrigins";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowSpecificOriginsPolicy,
        policy =>
        {
            policy
                 .WithOrigins(builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ?? new[] { "http://localhost:4200" })
                 .AllowAnyMethod()
                 .AllowAnyHeader();
        });
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
}); ;
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseCors(AllowSpecificOriginsPolicy);

app.UseMiddleware<BookStore.API.Middleware.ExceptionHandlingMiddleware>();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
