using GradHubDAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GradHubDAL.Configurations
{
    public class CandidateSkillConfiguration : IEntityTypeConfiguration<CandidateSkill>
    {
        public void Configure(EntityTypeBuilder<CandidateSkill> builder)
        {
            builder.ToTable("CandidateSkills");

            builder.HasKey(cs => cs.Id);

            builder.HasIndex(cs => new { cs.CandidateProfileId, cs.SkillId })
                   .IsUnique();

            builder.HasOne(cs => cs.CandidateProfile)
                   .WithMany(c => c.CandidateSkills)
                   .HasForeignKey(cs => cs.CandidateProfileId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(cs => cs.Skill)
                   .WithMany(s => s.CandidateSkills)
                   .HasForeignKey(cs => cs.SkillId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}