namespace GradHubDAL.Models
{
    public class User
    {
        public int Id { get; set; }

        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string PasswordHash { get; set; } = null!;

        /// <summary>"Student" | "Recruiter" | "Admin"</summary>
        public string Role { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Profile navigations (one-to-one, mutually exclusive by role)
        public CandidateProfile? CandidateProfile { get; set; }
        public CompanyProfile? CompanyProfile { get; set; }

        // Ratings
        public ICollection<Rating> RatingsGiven { get; set; } = new List<Rating>();
        public ICollection<Rating> RatingsReceived { get; set; } = new List<Rating>();

        // Messaging
        public ICollection<Conversation> ConversationsAsRecruiter { get; set; } = new List<Conversation>();
        public ICollection<Conversation> ConversationsAsStudent { get; set; } = new List<Conversation>();
        public ICollection<Message> MessagesSent { get; set; } = new List<Message>();
    }
}
