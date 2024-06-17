using cha_app.Domain.Entities;
using chat_app.Application.Interfaces;
using chat_app.Infrastructure.Data;
using FirebaseAdmin.Messaging;
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using Message = FirebaseAdmin.Messaging.Message;

namespace chat_app.Infrastructure;

public class NotificationService : INotificationService
{
    private readonly IMongoCollection<Subscriber> _database;

    public NotificationService(IOptions<MongoDbSettings> options)
    {
        var client = new MongoClient(options.Value.ConnectionString);
        _database = client.GetDatabase(options.Value.DatabaseName)
            .GetCollection<Subscriber>(options.Value.NotificationSubscribersCollectionName);
    }

    public async Task SendNotificationToEveryone(Notification notification)
    {
        var tasks = new List<Task>();
        var subscribers = await _database.Find(_ => true).ToListAsync();

        foreach (Subscriber sub in subscribers)
        {
            Message message = new Message()
            {
                Notification = notification,
                Token = sub.Token,
            };
            tasks.Add(SendNotificationAsync(message));
        }

        try
        {
            await Task.WhenAll(tasks);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

    public async Task AddPushSubscriber(string sub)
    {
        await _database.InsertOneAsync(new Subscriber {Token = sub});
        await Task.CompletedTask;
    }

    private async Task SendNotificationAsync(Message message)
    {
        try
        {
            await FirebaseMessaging.DefaultInstance.SendAsync(message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }
}
