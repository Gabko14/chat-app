using cha_app.Domain.Entities;
using cha_app.Domain.Interfaces;

namespace chat_app.Infrastructure.Repositories;

// IMessageRepository implementation in the Infrastructure project
public class MessageRepository : IMessageRepository
{
    private static readonly List<Message> Messages = new();

    public async Task<IEnumerable<Message>> GetAllMessagesAsync()
    {
        return await Task.FromResult(Messages);
    }

    public async Task<Message?> GetMessageByIdAsync(int messageId)
    {
        var message = Messages.FirstOrDefault(m => m.MessageId == messageId);
        return await Task.FromResult(message);
    }

    public async Task<Message> PostMessageAsync(Message message)
    {
        Messages.Add(message);
        return await Task.FromResult(message);
    }

    public async Task UpdateMessageAsync(Message message)
    {
        var existingMessage = Messages.FirstOrDefault(m => m.MessageId == message.MessageId);
        if (existingMessage != null)
        {
            Messages.Remove(existingMessage);
            Messages.Add(message);
        }

        await Task.CompletedTask;
    }

    public async Task DeleteMessageAsync(int messageId)
    {
        var message = Messages.FirstOrDefault(m => m.MessageId == messageId);
        if (message != null)
        {
            Messages.Remove(message);
        }

        await Task.CompletedTask;
    }
}