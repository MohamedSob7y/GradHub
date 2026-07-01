namespace GradHubDAL.Models
{
    public class Skill
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public ICollection<CandidateSkill> CandidateSkills { get; set; } = new List<CandidateSkill>();

        public ICollection<ProjectSkill> ProjectSkills { get; set; } = new List<ProjectSkill>();
    }
}
