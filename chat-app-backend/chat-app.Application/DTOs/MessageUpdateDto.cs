using System.ComponentModel.DataAnnotations;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;

namespace chat_app.Application.DTOs;

public class MessageUpdateDto
{
    [StringLength(1500, MinimumLength = 1, ErrorMessage = "Content must be between 1 and 1500 characters")]
    public required string Content { get; set; }
    
}