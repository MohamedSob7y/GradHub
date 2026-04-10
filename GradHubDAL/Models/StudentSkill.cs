using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GradHubDAL.Models
{
    public class StudentSkill
    {
        public int Id { get; set; }

        public int StudentProfileId { get; set; }

        public int SkillId { get; set; }

        // Navigation
        public StudentProfile StudentProfile { get; set; } = null!;

        public Skill Skill { get; set; } = null!;
    }
}
