using System.Net;
using cha_app.Domain.Entities;
using cha_app.Domain.Interfaces;
using chat_app.Infrastructure.Data;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace chat_app.Infrastructure.Repositories;

public class MessageRepository : IMessageRepository
{
    private readonly IMongoCollection<Message> _database;

    public MessageRepository(IOptions<MongoDbSettings> options)
    {
        var client = new MongoClient(options.Value.ConnectionString);
        _database = client.GetDatabase(options.Value.DatabaseName).GetCollection<Message>(options.Value.MessagesCollectionName);
    }

    public async Task<IEnumerable<Message>> GetAllMessagesAsync()
    {
        return await _database.Find(_ => true).ToListAsync();
    }

    public async Task<Message?> GetMessageByIdAsync(string messageId)
    {
        try
        {
            var objectId = new ObjectId(messageId);
            var message = await _database.FindAsync(m => m.MessageId == objectId).Result.FirstOrDefaultAsync();
            return await Task.FromResult(message);
        }
        catch (Exception e)
        {
            throw new InvalidDataException(e.Message);
        }
    }

    public async Task<Message> PostMessageAsync(Message message)
    {
        var messageObject = new Message
        {
            MessageId = new ObjectId(),
            Content = message.Content,
            Sender = message.Sender,
            Timestamp = DateTime.Now
        };
        await _database.InsertOneAsync(messageObject);
        return await _database.Find(m => m.MessageId == messageObject.MessageId).FirstOrDefaultAsync();
    }

    public async Task UpdateMessageAsync(Message message)
    {
        var existingMessage = _database.FindAsync(m => m.MessageId == message.MessageId).Result.FirstOrDefaultAsync();
        if (existingMessage != null)
        {
            await _database.DeleteOneAsync(m => m.MessageId == existingMessage.Result.MessageId);
            await _database.InsertOneAsync(message);
        }

        await Task.CompletedTask;
    }

    public async Task DeleteMessageAsync(string messageId)
    {
        var objectId = new ObjectId(messageId);
        var message = _database.FindAsync(m => m.MessageId == objectId).Result.FirstOrDefaultAsync();
        if (message != null)
        {
            await _database.DeleteOneAsync(m => m.MessageId == objectId);
        }

        await Task.CompletedTask;
    }
}