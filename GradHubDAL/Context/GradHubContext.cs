using GradHubDAL.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace GradHubDAL.Context
{
    public class GradHubContext : DbContext
    {
        public GradHubContext(DbContextOptions<GradHubContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<StudentProfile> StudentProfiles { get; set; }

        public DbSet<CompanyProfile> CompanyProfiles { get; set; }

        public DbSet<Skill> Skills { get; set; }

        public DbSet<StudentSkill> StudentSkills { get; set; }

        public DbSet<Rating> Ratings { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
        }
    }
}
