using cha_app.Domain.Entities;
using cha_app.Domain.Interfaces;

namespace chat_app.Infrastructure.Repositories;

public class MessageRepository : IMessageRepository
{
    private readonly List<Message> _messages = new();

    public async Task<IEnumerable<Message>> GetAllMessagesAsync()
    {
        return await Task.FromResult(_messages);
    }

    public async Task<Message?> GetMessageByIdAsync(int messageId)
    {
        var message = _messages.FirstOrDefault(m => m.MessageId == messageId);
        return await Task.FromResult(message);
    }

    public async Task<Message> PostMessageAsync(Message message)
    {
        _messages.Add(message);
        return await Task.FromResult(message);
    }

    public async Task UpdateMessageAsync(Message message)
    {
        var existingMessage = _messages.FirstOrDefault(m => m.MessageId == message.MessageId);
        if (existingMessage != null)
        {
            _messages.Remove(existingMessage);
            _messages.Add(message);
        }

        await Task.CompletedTask;
    }

    public async Task DeleteMessageAsync(int messageId)
    {
        var message = _messages.FirstOrDefault(m => m.MessageId == messageId);
        if (message != null)
        {
            _messages.Remove(message);
        }

        await Task.CompletedTask;
    }
}