using GradHubDAL.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace GradHubDAL.Configurations
{
    public class CompanyProfileConfiguration : IEntityTypeConfiguration<CompanyProfile>
    {
        public void Configure(EntityTypeBuilder<CompanyProfile> builder)
        {
            builder.ToTable("CompanyProfiles");

            builder.HasKey(c => c.Id);

            builder.HasIndex(c => c.UserId).IsUnique();

            builder.Property(c => c.CompanyName)
                   .IsRequired()
                   .HasMaxLength(150);

            builder.Property(c => c.Industry)
                   .IsRequired();

            builder.Property(c => c.VerificationStatus)
                   .HasDefaultValue("Pending");

            builder.Property(c => c.IsVerified)
                   .HasDefaultValue(false);

            builder.Property(c => c.AverageRating)
                   .HasColumnType("decimal(3,2)")
                   .HasDefaultValue(0);

            builder.Property(c => c.CreatedAt)
                   .HasDefaultValueSql("GETDATE()");

            builder.HasOne(c => c.User)
                   .WithOne(u => u.CompanyProfile)
                   .HasForeignKey<CompanyProfile>(c => c.UserId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}