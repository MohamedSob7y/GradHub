namespace GradHubDAL.Models
{
    public class CandidateProfile
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Field { get; set; } = string.Empty;

        public string? Bio { get; set; }

        public int ExperienceYears { get; set; } = 0;

        public string? GraduationProjectLink { get; set; }

        public string? PortfolioLink { get; set; }

        public string? LinkedInLink { get; set; }

        public string? WhatsAppNumber { get; set; }

        public string? ContactEmail { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; } = null!;

        public ICollection<CandidateSkill> CandidateSkills { get; set; } = new List<CandidateSkill>();

        public ICollection<GraduationProject> GraduationProjects { get; set; } = new List<GraduationProject>();
    }
}
