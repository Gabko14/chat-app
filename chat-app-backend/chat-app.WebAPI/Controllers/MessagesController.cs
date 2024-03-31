using chat_app.Application.DTOs;
using chat_app.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace chat_app.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class MessagesController(IMessageService messageService) : ControllerBase
{
    
    [HttpGet("")]
    public async Task<ActionResult<IEnumerable<MessageReadDto>>> GetAllMessages()
    {
        var messages = await messageService.GetAllMessagesAsync();
        if (!messages.Any()) return NoContent();
        return Ok(messages);
    }

    [HttpGet("{messageId}")]
    public async Task<ActionResult<MessageReadDto>> GetMessageById(int messageId)
    {
        var message = await messageService.GetMessageByIdAsync(messageId);
        if (message == null) return NotFound();
        return Ok(message);
    }    
    
    [HttpPost]
    public async Task<ActionResult<MessageReadDto>> CreateMessage([FromBody] MessageCreateDto message)
    {
        MessageReadDto createdMessage = await messageService.CreateMessageAsync(message);
        return CreatedAtAction(nameof(GetMessageById), new { messageId = createdMessage.MessageId }, createdMessage);
    }
    
    [HttpPut("{messageId}")]
    public async Task<IActionResult> UpdateMessage(int messageId, [FromBody] MessageUpdateDto message)
    {
        try
        {
            await messageService.UpdateMessageAsync(messageId, message);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }

        return NoContent(); // Successful update returns no content
    }

    [HttpDelete("{messageId}")]
    public async Task<IActionResult> DeleteMessage(int messageId)
    {
        try
        {
            await messageService.DeleteMessageAsync(messageId);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }

        return NoContent(); // Successful deletion returns no content
    }
}