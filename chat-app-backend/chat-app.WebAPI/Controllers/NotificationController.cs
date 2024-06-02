using chat_app.Application.Interfaces;
using FirebaseAdmin.Messaging;
using Microsoft.AspNetCore.Mvc;

namespace chat_app.WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class NotificationsController(INotificationService notificationService) : ControllerBase
{

    [HttpPost("add-subscriber")]
    public async Task<IActionResult> AddPushSubscriber(string fcmRegistrationToken)
    {
        await notificationService.AddPushSubscriber(fcmRegistrationToken);
        return Ok(new { Message = "Subscription added successfully." });
    }
}