using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GradHubDAL.Models
{
    public class Rating
    {
        public int Id { get; set; }
        public int FromUserId { get; set; }
        public int ToUserId { get; set; }
        public int Value { get; set; } // 1 to 5
        public string? Comment { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        // Navigation
        public User FromUser { get; set; } = null!;
        public User ToUser { get; set; } = null!;
    }
}
