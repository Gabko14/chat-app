using chat_app.Application.DTOs;
using chat_app.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace chat_app.WebApi.Hubs;

public class ChatHub(IMessageService messageService) : Hub
{
    private readonly IMessageService _messageService = messageService;

    public async Task SendMessage(string sender, string messageContent)
    {
        MessageCreateDto message = new MessageCreateDto
        {
            Content = messageContent,
            Sender = sender,
        };

        MessageReadDto savedMessage = await _messageService.CreateMessageAsync(message);

        await Clients.All.SendAsync("ReceiveMessage", savedMessage.Sender, savedMessage.Content);
    }
}