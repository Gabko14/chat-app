using chat_app.Application.Interfaces;
using FirebaseAdmin.Messaging;

namespace chat_app.Infrastructure;

public class NotificationService : INotificationService
{
    // TODO This is temporary until a db exists
    private static readonly List<string> Subscriptions = new();

    public async Task SendNotificationToEveryone(Notification notification)
    {
        // For parallel processing
        var tasks = new List<Task>();

        foreach (string sub in Subscriptions)
        {
            Message message = new Message()
            {
                Notification = notification,
                Token = sub,
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

    public Task AddPushSubscriber(string sub)
    {
        Subscriptions.Add(sub);
        return Task.CompletedTask;
    }
}