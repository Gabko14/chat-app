using AutoMapper;
using cha_app.Domain.Entities;
using cha_app.Domain.Interfaces;
using chat_app.Application.DTOs;
using chat_app.Application.Interfaces;

namespace chat_app.Application.Services;

public class MessageService(IMessageRepository messageRepository, IMapper mapper) : IMessageService
{
    public async Task<MessageReadDto> CreateMessageAsync(MessageCreateDto messageCreateDto)
    {
        var message = mapper.Map<Message>(messageCreateDto);
        message.Timestamp = DateTime.Now;
        
        var createdMessage = await messageRepository.PostMessageAsync(message);
        
        return mapper.Map<MessageReadDto>(createdMessage);
    }

    public async Task<IEnumerable<MessageReadDto>> GetAllMessagesAsync()
    {
        var messages = await messageRepository.GetAllMessagesAsync();
        return mapper.Map<IEnumerable<MessageReadDto>>(messages);
    }

    public async Task<MessageReadDto?> GetMessageByIdAsync(int messageId)
    {
        var message = await messageRepository.GetMessageByIdAsync(messageId);
        return mapper.Map<MessageReadDto>(message);
    }

    public async Task UpdateMessageAsync(int messageId, MessageUpdateDto updateDto)
    {
        var existingMessage = await messageRepository.GetMessageByIdAsync(messageId);
        if (existingMessage == null) throw new KeyNotFoundException($"Message with id: {messageId} not found.");
        
        var updatedMessage = mapper.Map(updateDto, existingMessage);
        
        await messageRepository.UpdateMessageAsync(updatedMessage);
    }

    public async Task DeleteMessageAsync(int messageId)
    {
        await messageRepository.DeleteMessageAsync(messageId);
    }
}
