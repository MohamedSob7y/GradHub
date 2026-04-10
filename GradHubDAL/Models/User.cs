using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GradHubDAL.Models
{
    public class User
    {
        public int Id { get; set; }

        public string FullName { get; set; } = null!;

        public string Email { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string Role { get; set; } = null!; // Student, Company, Admin

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation Properties
        public StudentProfile? StudentProfile { get; set; }

        public CompanyProfile? CompanyProfile { get; set; }

        public ICollection<Rating> RatingsGiven { get; set; } = new List<Rating>();

        public ICollection<Rating> RatingsReceived { get; set; } = new List<Rating>();
    }
}
