using cha_app.Domain.Entities;
using chat_app.Infrastructure.Repositories;
using MongoDB.Bson;

namespace Tests
{
    public class MessageRepositoryTests
    {
        private readonly MessageRepository _repository;

        public MessageRepositoryTests()
        {
            // _repository = new MessageRepository();
        }

        // [Fact]
        // public async Task PostMessageAsync_ShouldAddMessage()
        // {
        //     // Arrange
        //     var message = new Message { MessageId = new ObjectId("1"), Content = "Hello, World!", Sender = "gabo" };
        //
        //     // Act
        //     var result = await _repository.PostMessageAsync(message);
        //     var allMessages = await _repository.GetAllMessagesAsync();
        //
        //     // Assert
        //     Assert.NotNull(result);
        //     Assert.Contains(result, allMessages);
        // }
        //
        // [Fact]
        // public async Task GetAllMessagesAsync_ShouldReturnAllMessages()
        // {
        //     // Arrange
        //     var message1 = new Message { MessageId = new ObjectId("1"), Content = "Hello, World!", Sender = "gabo" };
        //     var message2 = new Message { MessageId = new ObjectId("2"), Content = "Hello, xUnit!", Sender = "mo" };
        //     await _repository.PostMessageAsync(message1);
        //     await _repository.PostMessageAsync(message2);
        //
        //     // Act
        //     var result = await _repository.GetAllMessagesAsync();
        //
        //     // Assert
        //     Assert.Equal(2, result.Count());
        // }
        //
        // [Fact]
        // public async Task GetMessageByIdAsync_ShouldReturnCorrectMessage()
        // {
        //     // Arrange
        //     var message = new Message { MessageId = new ObjectId("1"), Content = "Hello, World!", Sender = "gabo" };
        //     await _repository.PostMessageAsync(message);
        //
        //     // Act
        //     var result = await _repository.GetMessageByIdAsync("1");
        //
        //     // Assert
        //     Assert.NotNull(result);
        //     Assert.Equal("Hello, World!", result.Content);
        // }
        //
        // [Fact]
        // public async Task UpdateMessageAsync_ShouldUpdateMessage()
        // {
        //     // Arrange
        //     var message = new Message { MessageId = new ObjectId("1"), Content = "Hello, World!", Sender = "gabo" };
        //     await _repository.PostMessageAsync(message);
        //
        //     var updatedMessage = new Message { MessageId = new ObjectId("1"), Content = "Hello, Updated World!", Sender = "gabo" };
        //
        //     // Act
        //     await _repository.UpdateMessageAsync(updatedMessage);
        //     var result = await _repository.GetMessageByIdAsync("1");
        //
        //     // Assert
        //     Assert.NotNull(result);
        //     Assert.Equal("Hello, Updated World!", result.Content);
        // }
        //
        // [Fact]
        // public async Task DeleteMessageAsync_ShouldRemoveMessage()
        // {
        //     // Arrange
        //     var message = new Message { MessageId = new ObjectId("1"), Content = "Hello, World!", Sender = "gabo" };
        //     await _repository.PostMessageAsync(message);
        //
        //     // Act
        //     await _repository.DeleteMessageAsync("1");
        //     var result = await _repository.GetMessageByIdAsync("1");
        //
        //     // Assert
        //     Assert.Null(result);
        // }
    }
}