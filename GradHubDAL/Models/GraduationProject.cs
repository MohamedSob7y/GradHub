namespace GradHubDAL.Models
{
    public class GraduationProject
    {
        public int Id { get; set; }

        public int CandidateProfileId { get; set; }

        public string Title { get; set; } = null!;

        public string Description { get; set; } = null!;

        public string Category { get; set; } = null!;

        /// <summary>"Draft" or "Published"</summary>
        public string Status { get; set; } = "Draft";

        public string? GitHubLink { get; set; }

        public string? LiveDemoLink { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }

        public CandidateProfile CandidateProfile { get; set; } = null!;

        public ICollection<ProjectSkill> ProjectSkills { get; set; } = new List<ProjectSkill>();
    }
}
