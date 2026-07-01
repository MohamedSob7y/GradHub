using GradHubDAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GradHubDAL.Configurations
{
    public class ProjectSkillConfiguration : IEntityTypeConfiguration<ProjectSkill>
    {
        public void Configure(EntityTypeBuilder<ProjectSkill> builder)
        {
            builder.ToTable("ProjectSkills");

            builder.HasKey(ps => ps.Id);

            builder.HasIndex(ps => new { ps.GraduationProjectId, ps.SkillId })
                   .IsUnique();

            builder.HasOne(ps => ps.GraduationProject)
                   .WithMany(p => p.ProjectSkills)
                   .HasForeignKey(ps => ps.GraduationProjectId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(ps => ps.Skill)
                   .WithMany(s => s.ProjectSkills)
                   .HasForeignKey(ps => ps.SkillId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
