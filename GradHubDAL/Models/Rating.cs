namespace GradHubDAL.Models
{
    public class Rating
    {
        public int Id { get; set; }

        public int FromUserId { get; set; }

        public int ToUserId { get; set; }

        public int Value { get; set; }

        public string? Comment { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public User FromUser { get; set; } = null!;

        public User ToUser { get; set; } = null!;
    }
}