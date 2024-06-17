using chat_app.Application.DTOs;

namespace chat_app.Application.Interfaces;

public interface IMessageService
{
    Task<MessageReadDto> CreateMessageAsync(MessageCreateDto message);
    Task<IEnumerable<MessageReadDto>> GetAllMessagesAsync();
    Task<MessageReadDto?> GetMessageByIdAsync(string messageId);
    Task UpdateMessageAsync(string messageId, MessageUpdateDto updateDto);
    Task DeleteMessageAsync(string messageId);
}