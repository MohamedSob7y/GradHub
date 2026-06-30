namespace GradHubDAL.Models
{
    public class User
    {
        public int Id { get; set; }

        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string PasswordHash { get; set; } = null!;

        /// <summary>"Student" | "Recruiter"</summary>
        public string Role { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Profile navigations (one-to-one, mutually exclusive by role)
        public CandidateProfile? CandidateProfile { get; set; }
        public CompanyProfile? CompanyProfile { get; set; }

        // Removed: Ratings navigation — Phase 3, dropped from MVP
        // Removed: Messaging navigation — Phase 2, deferred
    }
}
