using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GradHubDAL.Models
{
    public class Skill
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        // Navigation
        public ICollection<StudentSkill> StudentSkills { get; set; } = new List<StudentSkill>();
    }
}
