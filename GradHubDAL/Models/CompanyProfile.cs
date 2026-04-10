using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GradHubDAL.Models
{
    public class CompanyProfile
    {
        public int Id { get; set; }

        public int UserId { get; set; }

        public string CompanyName { get; set; } = null!;

        public string? Description { get; set; }

        public string Industry { get; set; } = null!;

        public string? WebsiteLink { get; set; }

        public string? LinkedInLink { get; set; }

        public string? WhatsAppNumber { get; set; }

        public string? ContactEmail { get; set; }

        public string VerificationStatus { get; set; } = "Pending"; // Pending, Approved, Rejected

        public bool IsVerified { get; set; } = false;

        public decimal AverageRating { get; set; } = 0;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation
        public User User { get; set; } = null!;
    }
}
