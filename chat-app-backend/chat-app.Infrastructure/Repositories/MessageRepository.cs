using cha_app.Domain;
using cha_app.Domain.Entities;
using cha_app.Domain.Interfaces;
using chat_app.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace chat_app.Infrastructure.Repositories;

// IMessageRepository implementation in the Infrastructure project
public class MessageRepository(ApplicationDbContext context) : IMessageRepository
{

    public async Task<IEnumerable<Message>> GetAllMessagesAsync()
    {
        return await context.Messages.ToListAsync();
    }

    public async Task<Message?> GetMessageByIdAsync(int messageId)
    {
        return await context.Messages.FindAsync(messageId);
    }
    
    public async Task<Message> PostMessageAsync(Message message)
    {
        context.Messages.Add(message);
        await context.SaveChangesAsync();
        return message;
    }

    public async Task UpdateMessageAsync(Message message)
    {
        context.Messages.Update(message);
        await context.SaveChangesAsync();
    }

    public async Task DeleteMessageAsync(int messageId)
    {
        var message = await context.Messages.FindAsync(messageId);
        if (message != null)
        {
            context.Messages.Remove(message);
            await context.SaveChangesAsync();
        }
    }

}
