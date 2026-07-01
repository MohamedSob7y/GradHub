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

        // MVP tables
        public DbSet<User> Users { get; set; }
        public DbSet<CandidateProfile> CandidateProfiles { get; set; }
        public DbSet<CompanyProfile> CompanyProfiles { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<CandidateSkill> CandidateSkills { get; set; }
        public DbSet<GraduationProject> GraduationProjects { get; set; }
        public DbSet<ProjectSkill> ProjectSkills { get; set; }

        // Removed: DbSet<Rating>      — Phase 3, dropped from MVP
        // Removed: DbSet<Conversation> — Phase 2, build after MVP
        // Removed: DbSet<Message>      — Phase 2, build after MVP

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(GradHubContext).Assembly);

            // Skill seed data — seeded here so no admin CRUD endpoint is needed
            modelBuilder.Entity<Skill>().HasData(
                new Skill { Id = 1,  Name = "C#" },
                new Skill { Id = 2,  Name = "React" },
                new Skill { Id = 3,  Name = "Python" },
                new Skill { Id = 4,  Name = "Java" },
                new Skill { Id = 5,  Name = "SQL" },
                new Skill { Id = 6,  Name = "JavaScript" },
                new Skill { Id = 7,  Name = "TypeScript" },
                new Skill { Id = 8,  Name = "Node.js" },
                new Skill { Id = 9,  Name = "Angular" },
                new Skill { Id = 10, Name = "Docker" },
                new Skill { Id = 11, Name = "Git" },
                new Skill { Id = 12, Name = "Machine Learning" },
                new Skill { Id = 13, Name = "Flutter" },
                new Skill { Id = 14, Name = "Swift" },
                new Skill { Id = 15, Name = "Kotlin" }
            );
        }
    }
}
