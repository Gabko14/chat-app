using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

namespace chat_app.Application.DTOs;

public class MessageCreateDto
{
    [MaxLength(1500)]
    public required string Content { get; set; }
    
    [MaxLength(64)]
    public required string Sender { get; set; }
}