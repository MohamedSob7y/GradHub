namespace GradHubDAL.Models
{
    public class CompanyProfile
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string CompanyName { get; set; } = null!;

        public string Industry { get; set; } = null!;

        public string? Description { get; set; }

        public string? WebsiteLink { get; set; }

        public string? LinkedInLink { get; set; }

        public string? WhatsAppNumber { get; set; }

        public string? ContactEmail { get; set; }

        public string VerificationStatus { get; set; } = "Pending";

        public bool IsVerified { get; set; } = false;

        public decimal AverageRating { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public User User { get; set; } = null!;
    }
}