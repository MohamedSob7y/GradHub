namespace GradHubDAL.Models
{
    public class ProjectSkill
    {
        public int Id { get; set; }

        public int GraduationProjectId { get; set; }

        public int SkillId { get; set; }

        public GraduationProject GraduationProject { get; set; } = null!;

        public Skill Skill { get; set; } = null!;
    }
}
