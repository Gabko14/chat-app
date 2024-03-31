namespace chat_app.Application.DTOs;

public class MessageReadDto
{
    public int MessageId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string Sender { get; set; } = string.Empty;
}