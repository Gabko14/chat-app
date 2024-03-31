using System.ComponentModel.DataAnnotations;

namespace cha_app.Domain.Entities;

public class Message
{
    public int MessageId { get; set; }
    
    [StringLength(64, MinimumLength = 1)] 
    public required string Content { get; set; }
    
    
    public DateTime Timestamp { get; set; }
    
    [StringLength(64, MinimumLength = 1)] 
    public required string Sender { get; set; }
}