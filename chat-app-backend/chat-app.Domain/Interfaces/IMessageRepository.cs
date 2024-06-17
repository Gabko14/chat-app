using cha_app.Domain.Entities;
using MongoDB.Bson;

namespace cha_app.Domain.Interfaces;

public interface IMessageRepository
{
    Task<Message> PostMessageAsync(Message message);
    Task<IEnumerable<Message>> GetAllMessagesAsync();
    Task<Message?> GetMessageByIdAsync(string messageId);
    Task UpdateMessageAsync(Message message);
    Task DeleteMessageAsync(string messageId);
}