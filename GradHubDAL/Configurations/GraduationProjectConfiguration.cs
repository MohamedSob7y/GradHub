using GradHubDAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GradHubDAL.Configurations
{
    public class GraduationProjectConfiguration : IEntityTypeConfiguration<GraduationProject>
    {
        public void Configure(EntityTypeBuilder<GraduationProject> builder)
        {
            builder.ToTable("GraduationProjects");

            builder.HasKey(p => p.Id);

            builder.Property(p => p.Title)
                   .IsRequired()
                   .HasMaxLength(200);

            builder.Property(p => p.Description)
                   .IsRequired()
                   .HasMaxLength(2000);

            builder.Property(p => p.Category)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(p => p.Status)
                   .IsRequired()
                   .HasMaxLength(20)
                   .HasDefaultValue("Draft");

            builder.Property(p => p.CreatedAt)
                   .HasDefaultValueSql("GETDATE()");

            builder.HasOne(p => p.CandidateProfile)
                   .WithMany(c => c.GraduationProjects)
                   .HasForeignKey(p => p.CandidateProfileId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
