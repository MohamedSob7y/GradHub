using GradHubDAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GradHubDAL.Configurations
{
    public class CandidateProfileConfiguration : IEntityTypeConfiguration<CandidateProfile>
    {
        public void Configure(EntityTypeBuilder<CandidateProfile> builder)
        {
            builder.ToTable("CandidateProfiles");

            builder.HasKey(c => c.Id);

            builder.HasIndex(c => c.UserId).IsUnique();

            builder.Property(c => c.Field)
                   .IsRequired()
                   .HasMaxLength(100);

            builder.Property(c => c.Bio)
                   .HasMaxLength(1000);

            builder.Property(c => c.AverageRating)
                   .HasColumnType("decimal(3,2)")
                   .HasDefaultValue(0);

            builder.Property(c => c.CreatedAt)
                   .HasDefaultValueSql("GETDATE()");

            builder.HasOne(c => c.User)
                   .WithOne(u => u.CandidateProfile)
                   .HasForeignKey<CandidateProfile>(c => c.UserId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}