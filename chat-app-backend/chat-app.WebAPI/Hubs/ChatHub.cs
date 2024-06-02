using chat_app.Application.DTOs;
using chat_app.Application.Interfaces;
using FirebaseAdmin.Messaging;
using Microsoft.AspNetCore.SignalR;

namespace chat_app.WebApi.Hubs;

public class ChatHub(IMessageService messageService, INotificationService notificationService) : Hub
{
    public async Task SendMessage(string sender, string messageContent)
    {
        try
        {
            MessageCreateDto message = new MessageCreateDto
            {
                Content = messageContent ?? throw new ArgumentNullException(nameof(messageContent)),
                Sender = sender ?? throw new ArgumentNullException(nameof(sender))
            };

            MessageReadDto savedMessage = await messageService.CreateMessageAsync(message);

            await notificationService.SendNotificationToEveryone(new Notification
                { Title = savedMessage.Sender, Body = savedMessage.Content });

            await Clients.All.SendAsync("ReceiveMessage", savedMessage.Sender, savedMessage.Content);
        }
        catch (Exception)
        {
            throw new HubException("An error occured when sending the message");
        }
    }
}