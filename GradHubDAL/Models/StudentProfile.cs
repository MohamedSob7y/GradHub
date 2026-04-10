using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GradHubDAL.Models
{
    public class StudentProfile
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string Field { get; set; } = null!;

        public string? Bio { get; set; }

        public int ExperienceYears { get; set; }

        public string? CvFilePath { get; set; }

        public string? PortfolioLink { get; set; }

        public string? LinkedInLink { get; set; }

        public string? WhatsAppNumber { get; set; }

        public string? ContactEmail { get; set; }

        public decimal AverageRating { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation
        public User User { get; set; } = null!;

        public ICollection<StudentSkill> StudentSkills { get; set; } = new List<StudentSkill>();
    }
}
