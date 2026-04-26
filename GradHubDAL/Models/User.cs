namespace GradHubDAL.Models
{
    public class User
    {
        public int Id { get; set; }

        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string PasswordHash { get; set; } = null!;

        public string Role { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public CandidateProfile? CandidateProfile { get; set; }

        public CompanyProfile? CompanyProfile { get; set; }

        public ICollection<Rating> RatingsGiven { get; set; } = new List<Rating>();

        public ICollection<Rating> RatingsReceived { get; set; } = new List<Rating>();
    }
}