using cha_app.Domain.Entities;

namespace cha_app.Domain.Interfaces;

public interface IMessageRepository
{
    Task<Message> PostMessageAsync(Message message);
    Task<IEnumerable<Message>> GetAllMessagesAsync();
    Task<Message?> GetMessageByIdAsync(int messageId);
    Task UpdateMessageAsync(Message message);
    Task DeleteMessageAsync(int messageId);
}