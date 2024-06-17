namespace chat_app.Infrastructure.Data;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
    public string MessagesCollectionName { get; set; } = string.Empty;
    public string NotificationSubscribersCollectionName { get; set; } = string.Empty;
}