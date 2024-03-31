using System.Reflection;
using cha_app.Domain.Interfaces;
using chat_app.Application.Interfaces;
using chat_app.Application.Services;
using chat_app.Infrastructure.Data;
using chat_app.Infrastructure.Repositories;
using chat_app.WebApi.Hubs;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (connectionString is not null)
{
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
        options.UseMySQL(connectionString));
}

// Service Endpoint
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<IMessageService, MessageService>();

// Add SignalR
builder.Services.AddSignalR();

// Add Auto Mapper
var applicationAssembly = Assembly.Load("chat-app.Application");
builder.Services.AddAutoMapper(applicationAssembly);

// Add CORS Config
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        corsPolicyBuilder => corsPolicyBuilder
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials()
            .SetIsOriginAllowed((host) => true)); // For development, allow any origin
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // Configure CORS
    app.UseCors("CorsPolicy");
    
    // Automatically apply migrations
    using var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
    
    // Configure the HTTP request pipeline.
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler("/Home/Error");
app.UseHsts();
app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");
app.MapRazorPages();

// Map SignalR hubs
app.MapHub<ChatHub>("/chathub");

app.Run();
