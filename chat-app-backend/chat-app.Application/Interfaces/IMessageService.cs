using chat_app.Application.DTOs;

namespace chat_app.Application.Interfaces;

public interface IMessageService
{
    Task<MessageReadDto> CreateMessageAsync(MessageCreateDto message);
    Task<IEnumerable<MessageReadDto>> GetAllMessagesAsync();
    Task<MessageReadDto?> GetMessageByIdAsync(int messageId);
    Task UpdateMessageAsync(int messageId, MessageUpdateDto updateDto);
    Task DeleteMessageAsync(int messageId);
}