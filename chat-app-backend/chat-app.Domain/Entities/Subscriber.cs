using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace cha_app.Domain.Entities;

public class Subscriber
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId MessageId { get; set; }
    
    [BsonElement("token")]
    public string Token { get; set; }
}