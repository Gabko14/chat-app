using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace cha_app.Domain.Entities;

public class Message
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId MessageId { get; set; }
    
    [BsonElement("content")]
    public required string Content { get; set; }
    
    [BsonElement("sender")]
    public required string Sender { get; set; }
    
    [BsonElement("timestamp")]
    public DateTime Timestamp { get; set; }
}