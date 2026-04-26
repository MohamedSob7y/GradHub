namespace GradHubDAL.Models
{
    
    public class CandidateProfile
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Field { get; set; } = null!;

        public string? Bio { get; set; }

        public int ExperienceYears { get; set; }

        public string? CvFilePath { get; set; }

        public string? PortfolioLink { get; set; }

        public string? GraduationProjectLink { get; set; }

        public string? LinkedInLink { get; set; }

        public string? WhatsAppNumber { get; set; }

        public string? ContactEmail { get; set; }

        public decimal AverageRating { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public User User { get; set; } = null!;

        public ICollection<CandidateSkill> CandidateSkills { get; set; } = new List<CandidateSkill>();
    }
}