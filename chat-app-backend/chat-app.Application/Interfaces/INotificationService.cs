using FirebaseAdmin.Messaging;

namespace chat_app.Application.Interfaces;

public interface INotificationService
{
    Task SendNotificationToEveryone(Notification notification);
    Task AddPushSubscriber(string body);
}