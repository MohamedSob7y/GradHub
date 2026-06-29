using GradHubDAL.Models;
using Microsoft.EntityFrameworkCore;

namespace GradHubDAL.Context
{
    public class GradHubContext : DbContext
    {
        public GradHubContext(DbContextOptions<GradHubContext> options)
            : base(options)
        {
        }

        // Existing tables
        public DbSet<User> Users { get; set; }
        public DbSet<CandidateProfile> CandidateProfiles { get; set; }
        public DbSet<CompanyProfile> CompanyProfiles { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<CandidateSkill> CandidateSkills { get; set; }
        public DbSet<Rating> Ratings { get; set; }

        // New tables
        public DbSet<GraduationProject> GraduationProjects { get; set; }
        public DbSet<ProjectSkill> ProjectSkills { get; set; }
        public DbSet<Conversation> Conversations { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(GradHubContext).Assembly);
        }
    }
}
