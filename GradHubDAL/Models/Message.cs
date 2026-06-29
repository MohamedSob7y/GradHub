namespace GradHubDAL.Models
{
    public class Message
    {
        public int Id { get; set; }

        public int ConversationId { get; set; }

        public int SenderUserId { get; set; }

        public string Body { get; set; } = null!;

        public bool IsRead { get; set; } = false;

        public DateTime SentAt { get; set; } = DateTime.UtcNow;

        public Conversation Conversation { get; set; } = null!;

        public User Sender { get; set; } = null!;
    }
}
