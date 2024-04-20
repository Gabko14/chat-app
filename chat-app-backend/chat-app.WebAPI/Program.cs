using System.Reflection;
using cha_app.Domain.Interfaces;
using chat_app.Application.Interfaces;
using chat_app.Application.Services;
using chat_app.Infrastructure.Repositories;
using chat_app.WebApi.Hubs;

// Initialize a WebApplication builder
var builder = WebApplication.CreateBuilder(args);

// Configure the services for the application
builder.Services.AddEndpointsApiExplorer();  // Enable API explorer
builder.Services.AddSwaggerGen();  // Enable Swagger generation
builder.Services.AddControllersWithViews();  // Add the MVC services to DI container
builder.Services.AddRazorPages();  // Add Razor pages services to DI container

// Register our services with the DI container
builder.Services.AddScoped<IMessageRepository, MessageRepository>();  // Register IMessageRepository
builder.Services.AddScoped<IMessageService, MessageService>();  // Register IMessageService
builder.Services.AddSignalR();  // Add SignalR services to the DI container

// Configure AutoMapper to use profiles defined in the Application assembly
var applicationAssembly = Assembly.Load("chat-app.Application");
builder.Services.AddAutoMapper(applicationAssembly);

// Set up Kestrel to listen on specific URLs
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    // Bind to port 80 on all network interfaces
    serverOptions.ListenAnyIP(80);
});


// Configure CORS to allow any origin, method, and header
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", corsPolicyBuilder => corsPolicyBuilder
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials()
        .SetIsOriginAllowed(host => true));
});

// Build the application.    
var app = builder.Build();

// Configure the HTTP pipeline
app.UseCors("CorsPolicy");  // Apply CORS policy
app.UseSwagger();  // Enable Swagger
app.UseSwaggerUI();  // Enable Swagger UI
app.UseExceptionHandler("/Home/Error");  // Configure built-in exception handler
app.UseHsts();  // Add the Hsts middleware
app.UseHttpsRedirection();  // Add the HTTPS Redirection middleware
app.UseRouting();  // Add endpoint routing
app.UseAuthorization();  // Add authorization middleware

// Configure the routes
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");  // Default MVC route
app.MapRazorPages();  // Map Razor pages
app.MapHub<ChatHub>("/chathub");  // Map SignalR hubs

app.Run();