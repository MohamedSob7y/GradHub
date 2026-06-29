namespace GradHubDAL.Models
{
    public class Conversation
    {
        public int Id { get; set; }

        public int RecruiterId { get; set; }

        public int StudentId { get; set; }

        public string? JobPositionTitle { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User Recruiter { get; set; } = null!;

        public User Student { get; set; } = null!;

        public ICollection<Message> Messages { get; set; } = new List<Message>();
    }
}
