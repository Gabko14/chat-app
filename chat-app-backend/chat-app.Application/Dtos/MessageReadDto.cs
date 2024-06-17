namespace chat_app.Application.DTOs;

public class MessageReadDto
{
    public string MessageId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; }
    public string Sender { get; set; } = string.Empty;
}